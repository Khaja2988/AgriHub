# AGRIHUB - Functional Requirements Specification

## 1. User Roles
- **FARMER (Primary):** Authenticates, accesses personalized dashboard, uploads leaf images for disease diagnosis, reviews treatments, monitors e-NAM prices, contacts buyers/FPOs, books storage/transport, runs decision calculations, and tracks selling requests.
- **ADMIN:** Monitors platform statistics, manages master crop data, indicative mandi prices, and verified aggregator listings.
- **BUYER / FPO / LOGISTICS / STORAGE PROVIDER:** Secondary entities receiving farmer inquiries and fulfillment dispatches.

## 2. Core Functional Modules

### 2.1 Authentication & Profile Management
- `POST /api/auth/register`: Create user account with name, email, password, phone, role, and language.
- `POST /api/auth/login`: Authenticate with JWT token issuance (30 days validity).
- `POST /api/auth/demo-login`: Instant 1-click evaluation login for "Ravi Kumar", Tomato farmer in Kaza, Guntur, AP.
- `GET /api/farmers/profile` & `PUT /api/farmers/profile`: View and update landholding size, village, district, and crops grown.

### 2.2 Crop Catalog & Disease Detection
- `GET /api/crops`: List of supported crops with vernacular names, seasons, and common pests.
- `POST /api/diagnosis`: Multipart image upload of affected foliage. Runs diagnosis through `DiagnosisProvider`.
- Response contract: `crop`, `condition`, `type`, `confidence`, `severity`, `symptoms`, `treatment`, `prevention`, `provider`, `isDemo`.
- Labeling mandate: Must clearly present "AI-assisted Demo Diagnosis" and toll-free helpline.

### 2.3 Practical Treatment Guidance
- `GET /api/treatments/:condition`: Structured action cards (pruning, irrigation control, spacing, certified bio-fungicide) without hazardous unapproved chemicals.

### 2.4 Indicative Mandi Prices (e-NAM Format)
- `GET /api/market-prices`: Displays min, modal, max prices per commodity and district.
- Labeling mandate: Labeled as "Indicative / Demo Market Data".

### 2.5 Buyer & FPO Aggregation
- `GET /api/buyers` & `GET /api/fpos`: Filterable by crop, district, and quantity.
- Direct inquiry dispatch with farmer phone number sharing.

### 2.6 Cold Storage & Rural Logistics
- `GET /api/storage`: Available capacity, temperature specs, and indicative monthly tariff per kg.
- `GET /api/logistics`: Vehicle payload (mini-trucks, tempo), service radii, and estimated freight.

### 2.7 Farm-to-Market Decision Engine
- `POST /api/selling/calculate`:
  - `Gross Value = Quantity * Modal Price`
  - `Storage Deduction = Quantity * Tariff * Months`
  - `Transport Deduction = Base Fare + (Distance * RatePerKm)`
  - `Handling Costs = Flat Loading & Bagging Fee`
  - `Estimated Net Return = Gross Value - (Storage + Transport + Handling)`

### 2.8 9-Step Selling Wizard
- Step 1: Select Crop -> Step 2: Quantity -> Step 3: Harvest Date -> Step 4: Market Price -> Step 5: Buyer/FPO -> Step 6: Storage -> Step 7: Transport -> Step 8: Net Breakdown -> Step 9: Broadcast Request.
