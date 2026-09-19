/**
 * Base abstract class for Diagnosis Providers
 */
class DiagnosisProvider {
  /**
   * Diagnose crop health from an image buffer and crop name
   * @param {Object} params - { crop, imageFile, metadata }
   * @returns {Promise<Object>} Diagnosis result
   */
  async diagnose({ crop, imageFile, metadata }) {
    throw new Error('diagnose() method must be implemented by concrete DiagnosisProvider subclass');
  }

  getProviderName() {
    return 'BaseDiagnosisProvider';
  }

  isDemoProvider() {
    return false;
  }
}

module.exports = DiagnosisProvider;
