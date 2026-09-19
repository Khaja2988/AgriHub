# AGRIHUB - Requirements Document

## 1. Problem Statement
Small and marginal farmers across India face critical challenges spanning the agricultural lifecycle:
- High vulnerability to crop diseases and pest attacks without timely, affordable diagnosis.
- Inability to negotiate fair prices due to heavy dependence on commission agents and middlemen.
- Lack of access to cold-storage facilities during harvest gluts, forcing distress sales at unremunerative prices.
- Fragmented rural transport logistics leading to post-harvest losses and high transit costs.
- Low smartphone literacy and regional language barriers preventing adoption of conventional tech platforms.
- Intermittent and unreliable rural internet connectivity disrupting digital transactions.

## 2. Solution Overview: AGRIHUB
**AGRIHUB** is an integrated, multilingual, farmer-first platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js) that unifies crop health diagnosis and direct market access into one end-to-end workflow:
**CROP -> CARE -> MARKET -> STORAGE -> LOGISTICS -> SELL**

## 3. Scope and Milestones
- **P0 (Must Have):**
  - Instant 1-click Demo Account (Ravi Kumar, Guntur AP).
  - AI-assisted Crop Disease & Pest Diagnosis with clear disclosure.
  - Practical, safe treatment guidance action cards.
  - Indicative Mandi Market Prices (e-NAM format).
  - Direct connection to verified buyers and registered FPOs.
  - Nearby cold-storage discovery and booking.
  - Rural logistics & mini-truck booking.
  - Farm-to-Market Decision Engine (Net Return = Gross - Storage - Transport - Handling).
  - 9-Step Selling Wizard and request tracking.
- **P1 (Required):**
  - Full localization in Telugu (తెలుగు), Hindi (हिन्दी), and English.
  - Offline-first resilience (cached records, drafts, auto-sync on reconnect).
  - MongoDB Atlas persistence with resilient in-memory fallback.
  - Administration dashboard.
