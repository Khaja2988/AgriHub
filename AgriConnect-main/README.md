# 🌾 AGRIHUB (అగ్రిహబ్)
### Smart Crop Care & Direct Market Access for Small and Marginal Farmers

> **Transforming the Fragmented Farmer Experience:**
> **CROP ➔ CARE ➔ MARKET ➔ STORAGE ➔ LOGISTICS ➔ SELL**

---

## 1. Problem Statement & Mission
Small and marginal farmers in India encounter systemic obstacles that reduce their net agricultural income:
1. **Late Disease Identification:** Fungal blights, viral leaf curls, and pest attacks damage up to 30-40% of yields before corrective action can be taken.
2. **Heavy Middleman Exploitation:** Commission agents and unorganized traders capture disproportionate margins while providing no pricing transparency.
3. **Distress Selling:** Lack of accessible cold storage during peak harvest gluts forces farmers to sell perishable produce at steep discounts.
4. **Fragmented Rural Freight:** Difficulty in securing affordable mini-trucks and farmgate pickup leads to transit spoilage.
5. **Language & Digital Literacy Barriers:** Complex e-commerce interfaces fail farmers with basic smartphones who require regional languages.
6. **Intermittent Connectivity:** Poor rural mobile networks disrupt online applications.

**AGRIHUB** bridges these gaps by providing an integrated, farmer-first workflow that unifies AI-assisted crop diagnosis, indicative market pricing (aligned with e-NAM), cold-storage booking, rural transport matching, and a transparent **Farm-to-Market Decision Engine** that computes real net farmer earnings.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, JavaScript (ES6+), React Router v6, Axios, Bootstrap, Material UI Icons |
| **Localization** | Centralized i18n dictionaries for **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, and **English** |
| **Offline Resilience** | Network listeners, LocalStorage / IndexedDB drafts, automatic sync queue |
| **Backend Runtime** | Node.js v23, Express.js 4, RESTful APIs, Morgan logger, CORS |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing, Role-Based Access Control |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose 8 with resilient connection handling |
| **File Processing** | Multer with strict image MIME validation (JPEG, PNG, WEBP) and 10MB limit |
| **AI Architecture** | `DiagnosisProvider` abstraction pattern (`DemoDiagnosisProvider` & `MLDiagnosisProvider`) |

> ⚠️ **Note on Architecture Migration:** The legacy Java / Spring Boot / MySQL backend from AgriConnect has been completely deprecated and replaced with this modern Node.js + Express + MongoDB architecture.

---

## 3. Project Structure

```
AgriConnect-main/
├── backend/                       # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── config/                # Database connection & in-memory mock repository
│   │   ├── controllers/           # Auth, Farmer, Crop, Diagnosis, Market, Selling, Admin
│   │   ├── middleware/            # JWT protect/authorize & Multer image upload
│   │   ├── models/                # Mongoose models: User, Crop, Diagnosis, MarketPrice, etc.
│   │   ├── providers/diagnosis/   # DiagnosisProvider, DemoDiagnosisProvider, MLDiagnosisProvider
│   │   ├── routes/                # Express API routes
│   │   ├── seed/                  # Database seeder script with realistic Andhra Pradesh data
│   │   ├── services/              # DiagnosisService & Farm-to-Market DecisionEngineService
│   │   ├── app.js                 # Express app configuration & error handlers
│   │   └── server.js              # Server entry point (Port 5000)
│   ├── .env                       # Backend environment variables
│   └── package.json
│
├── AgriConnectFrontend/           # React + Vite Frontend
│   ├── src/
│   │   ├── components/            # Responsive Navbar, Footer
│   │   ├── context/               # AuthContext (JWT & 1-click Demo Login)
│   │   ├── i18n/                  # Centralized translations: Telugu (te), Hindi (hi), English (en)
│   │   ├── offline/               # OfflineBanner & LocalStorage caching helpers
│   │   ├── pages/                 # FarmerDashboard, CropDiagnosis, MarketPrices, SellingWizard...
│   │   ├── services/              # Axios API client
│   │   ├── App.jsx                # Main router
│   │   └── main.jsx
│   ├── .env                       # Frontend environment (VITE_API_URL=http://localhost:5000)
│   └── package.json
│
└── docs/                          # Comprehensive Technical Documentation
    ├── REQUIREMENTS.md
    ├── FUNCTIONAL_REQUIREMENTS.md
    ├── ARCHITECTURE.md
    ├── API.md
    └── DEMO_FLOW.md
```

---

## 4. Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- MongoDB Atlas cluster URL (or local MongoDB on port 27017)

### Step 1: Clone / Navigate to Project
```bash
cd c:/D-drive/GIGPOINT/AgriConnect-main
```

### Step 2: Configure & Start Backend
```bash
cd backend
npm install
```

Configure `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agrihub?retryWrites=true&w=majority
JWT_SECRET=agrihub_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If MongoDB Atlas is not yet configured, AGRIHUB automatically runs using its high-performance resilient in-memory fallback without throwing errors).*

Seed realistic demo records:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# Backend runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Step 3: Configure & Start Frontend
In a new terminal:
```bash
cd ../AgriConnectFrontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 5. Demo Credentials & 1-Click Shortcut

| User Role | Name | Email | Password | Details |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Farmer** | Ravi Kumar | `ravi.kumar@agrihub.in` | `password123` | Kaza, Guntur, AP (2 acres, Tomato/Chilli) |
| **Administrator** | AGRIHUB Admin | `admin@agrihub.in` | `adminpassword123` | Platform oversight & mandi price updates |

> ⚡ **Evaluator Shortcut:** Simply click the bright yellow **"START DEMO"** button on the Navbar or Landing Page to authenticate as Ravi Kumar instantly with zero typing.

---

## 6. The 3-5 Minute Core Demo Flow

```
Landing Page ("START DEMO")
  ↓
Farmer Dashboard (10 Action Cards in Telugu/Hindi/English)
  ↓
Diagnose Crop (Upload leaf or pick demo Tomato sample)
  ↓
Diagnosis Result ("AI-assisted Demo Diagnosis" + 89% Confidence + Action Steps)
  ↓
Treatment Guidance (Safe cultural practices + Kisan Call Centre 1800-180-1551)
  ↓
Check Mandi Prices (e-NAM indicative modal price ₹22/kg)
  ↓
Find Buyers & FPOs (Verified traders & FPCs)
  ↓
Cold Storage & Logistics (Tariffs & mini-truck booking)
  ↓
Farm-to-Market Decision Engine (Gross: ₹22,000 - Storage: ₹2,000 - Transit: ₹1,500 = Net: ₹18,250)
  ↓
Submit Selling Request
  ↓
Live Tracking in "My Requests" Dashboard
```

---

## 7. AI & Compliance Principles
- **No Fabricated Accuracy:** In strict accordance with hackathon guidelines, demo diagnosis outputs are clearly marked as **"AI-assisted Demo Diagnosis"**.
- **Chemical Safety:** Chemical dosage instructions are kept safe and non-prescriptive, prioritizing cultural pruning, sanitation, bio-fungicides, and official extension officer contact.
- **Indicative Market Data:** Mandi prices are transparently tagged as **"Indicative / Demo Market Data (e-NAM Format)"**.
