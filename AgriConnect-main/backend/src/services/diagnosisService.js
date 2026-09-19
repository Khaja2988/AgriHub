const mongoose = require('mongoose');
const aiDiagnosisProvider = require('../providers/diagnosis/AIDiagnosisProvider');
const DemoDiagnosisProvider = require('../providers/diagnosis/DemoDiagnosisProvider');
const Diagnosis = require('../models/Diagnosis');

class DiagnosisService {
  constructor() {
    this.aiProvider = aiDiagnosisProvider;
    this.demoProvider = new DemoDiagnosisProvider();
  }

  getProvider() {
    return this.aiProvider;
  }

  async runDiagnosis({ crop, imageFile, farmerId, metadata }) {
    const provider = this.getProvider();
    let result;
    
    try {
      result = await provider.diagnose({ crop, imageFile, metadata });
    } catch (err) {
      console.warn(`[DiagnosisService] Primary provider error: ${err.message}. Falling back to demo.`);
      result = await this.demoProvider.diagnose({ crop, imageFile, metadata });
    }

    // Persist diagnosis record if database is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const diagnosisDoc = new Diagnosis({
          farmer: farmerId || null,
          crop: result.crop,
          condition: result.condition,
          type: result.type,
          confidence: result.confidence,
          severity: result.severity,
          symptoms: result.symptoms,
          treatment: result.treatment,
          prevention: result.prevention,
          provider: result.provider,
          isDemo: result.isDemo,
          imageUrl: result.imageUrl
        });
        await diagnosisDoc.save();
        result._id = diagnosisDoc._id;
      } catch (dbErr) {
        console.warn(`[DiagnosisService] Could not save diagnosis record to DB: ${dbErr.message}`);
      }
    }

    return result;
  }
}

module.exports = new DiagnosisService();
