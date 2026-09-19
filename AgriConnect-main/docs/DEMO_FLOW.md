# AGRIHUB - 3-5 Minute End-to-End Demo Script

## Persona: Ravi Kumar
- **Role:** Smallholder Tomato Farmer
- **Location:** Kaza Village, Guntur District, Andhra Pradesh
- **Farm Size:** 2 Acres
- **Primary Language:** Telugu (తెలుగు)

---

## Step-by-Step Evaluator Walkthrough

### 1. Landing Page & 1-Click Demo Entry (0:00 - 0:30)
1. Open frontend: `http://localhost:5173`.
2. Notice the **AGRIHUB** branding, subtitle *"Smart Crop Care & Direct Market Access for Farmers"*, and the 6-step journey map.
3. Click the bright yellow **"⚡ START DEMO (రవి కుమార్ - Tomato Demo)"** button.
4. The system logs in as Ravi Kumar instantly via JWT and navigates to `/farmer-dashboard`.

### 2. Farmer Dashboard & Multilingual Selection (0:30 - 1:00)
1. View the 10 large, farmer-first action cards (Diagnose, Treatment, Market, Buyers, FPOs, Storage, Logistics, Sell, Requests, Profile).
2. Notice the Rythu summary bar at top: *Kaza, Guntur | 2 acres | Verified Rythu ID*.
3. Use the navbar language selector to toggle between **తెలుగు**, **English**, and **हिन्दी**. Notice the entire UI updates smoothly without reload.
4. Click **"Diagnose Crop"** (పంట వ్యాధి నిర్ధారణ).

### 3. AI-assisted Crop Disease Diagnosis (1:00 - 1:45)
1. Under Step 1, "Tomato" is pre-selected.
2. Under Step 2, click the demo shortcut button **"🍅 Tomato Leaf (Blight Sample)"** or upload an image.
3. Click **"🔍 Analyze Crop Health"**.
4. Review the diagnosis card:
   - Condition: **Early Blight (Alternaria solani)**
   - Severity: **Medium**
   - Confidence: **89%**
   - Disclaimer badge: **"AI-assisted Demo Diagnosis"**
   - Observed Symptoms & 5 Immediate Action Steps.
5. Click **"💊 View Complete Treatment Advice"** to see preventive cultural steps and Kisan Call Centre hotline (1800-180-1551).
6. Click **"💰 Proceed to Sell Produce ➔"** to transition seamlessly to the market flow.

### 4. Farm-to-Market Decision Engine & Selling Wizard (1:45 - 3:00)
1. The 9-step Selling Wizard opens with `Tomato` pre-populated.
2. Step 1 (Crop): Tomato confirmed -> Click **Next**.
3. Step 2 (Quantity): Enter **1,000 kg** (10 Quintals) -> Click **Next**.
4. Step 3 (Harvest Date): Tomorrow's date -> Click **Next**.
5. Step 4 (Market Prices): View Guntur Mandi indicative rate (₹22/kg) -> Click **Next**.
6. Step 5 (Buyer/FPO): Select verified trader *Sri Krishna Agro Traders* -> Click **Next**.
7. Step 6 (Storage): Toggle Cold Storage reservation (Guntur Central Cold Chain Warehouse @ ₹2/kg/mo) -> Click **Next**.
8. Step 7 (Logistics): Select rural pickup mini-truck *Kisan Rural Logistics* -> Click **Next**.
9. **Step 8 (Decision Engine Breakdown):**
   - Gross Value (1,000 kg × ₹22/kg) = **₹22,000**
   - Storage deduction = **-₹2,000**
   - Transport deduction = **-₹1,500**
   - Handling & Bagging = **-₹250**
   - **Estimated Net Take-Home = ₹18,250 (~83% Net Margin)**
10. Click **Next** to Step 9, then click **"✓ Confirm & Submit Selling Request"**.

### 5. Selling Request Tracking (3:00 - 3:30)
1. System automatically redirects to `/my-requests`.
2. See the new request listed with **Pending Verification** badge, verified buyer, pickup location, and estimated net pay.
3. Notice that all data is persisted in the database and also saved locally for offline safety.
