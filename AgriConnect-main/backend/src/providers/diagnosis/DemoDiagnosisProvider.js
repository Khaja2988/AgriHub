const DiagnosisProvider = require('./DiagnosisProvider');

const KNOWLEDGE_BASE = {
  tomato: {
    condition: 'Early Blight (Alternaria solani)',
    type: 'Disease',
    confidence: 89,
    severity: 'Medium',
    symptoms: 'Dark brown to black concentric ring lesions on older leaves, yellow halo surrounding spots, drying of foliage.',
    immediateSteps: [
      'Prune and destroy heavily affected lower leaves immediately to stop spore spread.',
      'Water at the base of the plant only; keep leaves dry.',
      'Ensure proper spacing and staking for better airflow and sunlight penetration.',
      'Apply neem-oil extract or certified copper-based fungicide as per local KVK advisory.',
      'Monitor surrounding plants every 48 hours.'
    ],
    treatment: 'Spray Copper Oxychloride 50 WP (3g/litre) or Mancozeb 75 WP (2g/litre) on lower and middle foliage. Maintain 7-10 day spray interval.',
    prevention: 'Practice 2-3 year crop rotation away from solanaceous crops. Use certified disease-free seeds and apply organic mulch to prevent rain splash from soil.',
    expertAdvisory: 'If lesions spread to stem or fruit, consult your local Mandal Agriculture Officer (MAO) or call Kisan Call Centre at 1800-180-1551.'
  },
  chilli: {
    condition: 'Chilli Leaf Curl Virus (transmitted by Whitefly)',
    type: 'Pest & Virus',
    confidence: 86,
    severity: 'Medium',
    symptoms: 'Upward curling and puckering of leaves, stunted plant height, reduced leaf size, flower drop.',
    immediateSteps: [
      'Install yellow sticky traps (10-15 per acre) to monitor and catch whiteflies.',
      'Uproot and bury severely stunted, virus-infected plants.',
      'Avoid excessive nitrogen fertilizer application which promotes succulent growth favored by pests.'
    ],
    treatment: 'Control vector whiteflies with Neem oil (5ml/L) or approved systemic insecticide (Diafenthiuron 50 WP @ 1.25g/L).',
    prevention: 'Grow 2-3 border rows of maize or jowar as barrier crops. Use silver/black reflective mulching.',
    expertAdvisory: 'Whitefly vectors develop quick pesticide resistance. Consult Rythu Bharosa Kendram (RBK) for recommended rotational spray schedule.'
  },
  rice: {
    condition: 'Rice Blast (Magnaporthe oryzae)',
    type: 'Disease',
    confidence: 91,
    severity: 'High',
    symptoms: 'Spindle-shaped or eye-shaped lesions with greyish centres and dark brown margins on leaf blades.',
    immediateSteps: [
      'Drain stagnant water from the field if water is too deep; maintain thin sheet of water.',
      'Stop top-dressing with nitrogen fertilizer until blast symptoms subside.',
      'Check neck and node blast symptoms in panicles.'
    ],
    treatment: 'Apply Tricyclazole 75 WP @ 0.6g/L or Isoprothiolane 40 EC @ 1.5ml/L at early tillering and panicle emergence.',
    prevention: 'Seed treatment with Carbendazim 2g/kg seed. Plant blast-resistant varieties suited for your agro-climatic zone.',
    expertAdvisory: 'Blast can cause rapid yield loss under humid cloudy weather. Contact Agriculture Extension Officer immediately.'
  },
  cotton: {
    condition: 'Pink Bollworm (Pectinophora gossypiella)',
    type: 'Pest',
    confidence: 88,
    severity: 'High',
    symptoms: 'Rosetted flowers that fail to open, entry holes in green bolls, stained lint, premature boll opening.',
    immediateSteps: [
      'Collect and destroy shed squares, flowers, and dropped bolls.',
      'Install pheromone traps (5 traps/acre) for monitoring adult moth catches.',
      'Avoid extending crop season beyond recommended duration.'
    ],
    treatment: 'Apply Neem-based formulations (Azadirachtin 1500 ppm @ 5ml/L) or Profenofos 50 EC @ 2ml/L based on trap catch thresholds (8 moths/trap/night for 3 consecutive days).',
    prevention: 'Mass trapping using 15-20 pheromone traps per acre. Synchronized community sowing.',
    expertAdvisory: 'Report sudden infestations to local KVK or Cotton Research Station.'
  },
  default: {
    condition: 'Leaf Spot & Foliar Fungal Infection',
    type: 'Disease',
    confidence: 84,
    severity: 'Medium',
    symptoms: 'Irregular brown spots on leaves, marginal scorching, chlorosis.',
    immediateSteps: [
      'Isolate and remove diseased leaves.',
      'Improve furrow drainage to avoid standing water.',
      'Ensure balanced NPK nutrition.'
    ],
    treatment: 'Spray Mancozeb (2.5g/L) or Copper Hydroxide (2g/L) on affected foliage during calm, non-rainy morning hours.',
    prevention: 'Sanitize farming tools, practice crop rotation, and avoid dense sowing.',
    expertAdvisory: 'For exact disease identification, show physical leaf sample to local agriculture extension officer.'
  }
};

class DemoDiagnosisProvider extends DiagnosisProvider {
  getProviderName() {
    return 'DemoDiagnosisProvider (AI-assisted Demonstration Provider)';
  }

  isDemoProvider() {
    return true;
  }

  async diagnose({ crop, imageFile, metadata }) {
    const normalizedCrop = (crop || 'tomato').toLowerCase().trim();
    const knowledge = KNOWLEDGE_BASE[normalizedCrop] || KNOWLEDGE_BASE.default;

    return {
      crop: crop || 'Tomato',
      condition: knowledge.condition,
      type: knowledge.type,
      confidence: knowledge.confidence,
      severity: knowledge.severity,
      symptoms: knowledge.symptoms,
      immediateSteps: knowledge.immediateSteps,
      treatment: knowledge.treatment,
      prevention: knowledge.prevention,
      expertAdvisory: knowledge.expertAdvisory,
      provider: this.getProviderName(),
      isDemo: true,
      imageName: imageFile ? imageFile.originalname : 'leaf_sample.jpg',
      imageUrl: imageFile ? `/uploads/${imageFile.filename}` : '/assets/tomato_leaf.jpg',
      disclaimer: 'AI-assisted Demonstration Diagnosis. For official and emergency plant protection, please consult your Mandal Agricultural Officer or call 1800-180-1551.'
    };
  }
}

module.exports = DemoDiagnosisProvider;
