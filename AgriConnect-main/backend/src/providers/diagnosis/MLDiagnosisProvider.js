const DiagnosisProvider = require('./DiagnosisProvider');

/**
 * MLDiagnosisProvider - Designed to interface with real Computer Vision / ML model service
 * (e.g. FastAPI, TensorFlow Serving, or ONNX Runtime).
 */
class MLDiagnosisProvider extends DiagnosisProvider {
  constructor(endpointUrl = process.env.ML_SERVICE_URL) {
    super();
    this.endpointUrl = endpointUrl;
  }

  getProviderName() {
    return 'MLDiagnosisProvider (Pretrained Computer Vision Model)';
  }

  isDemoProvider() {
    return false;
  }

  async diagnose({ crop, imageFile, metadata }) {
    if (!this.endpointUrl) {
      throw new Error('ML Service endpoint is not configured. Falling back to DemoDiagnosisProvider.');
    }
    
    // In production with live ML service:
    // const formData = new FormData();
    // formData.append('image', fs.createReadStream(imageFile.path));
    // formData.append('crop', crop);
    // const res = await axios.post(`${this.endpointUrl}/predict`, formData);
    // return res.data;
    
    throw new Error('No live ML model server connected at ' + this.endpointUrl);
  }
}

module.exports = MLDiagnosisProvider;
