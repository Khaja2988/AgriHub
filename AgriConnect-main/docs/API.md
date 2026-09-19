# AGRIHUB - API Specification

Base URL: `http://localhost:5000`

All responses follow unified JSON contracts:
```json
// Success
{ "success": true, "data": {} }

// Error
{ "success": false, "message": "Readable description" }
```

---

## 1. Authentication
- `POST /api/auth/register`
  - Body: `{ name, email, password, phone, role, village, district, state, farmSize, cropsGrown, preferredLanguage }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
- `POST /api/auth/demo-login`
  - Body: `{}` (Returns Ravi Kumar token and farmer profile)
- `GET /api/auth/me`
  - Header: `Authorization: Bearer <token>`

---

## 2. Farmer Profile
- `GET /api/farmers/profile`
- `PUT /api/farmers/profile`
  - Body: `{ name, phone, village, district, state, farmSize, cropsGrown, preferredLanguage }`

---

## 3. Crop Catalog & Diagnosis
- `GET /api/crops`
- `GET /api/crops/:name`
- `POST /api/diagnosis`
  - Body (Multipart Form): `crop` (string), `image` (file)
  - Returns: `{ crop, condition, type, confidence, severity, symptoms, immediateSteps, treatment, prevention, provider, isDemo }`
- `GET /api/treatments/:condition`
  - Returns practical action cards, cultural prevention steps, and Kisan Call Centre hotline.

---

## 4. Market Prices (Indicative e-NAM Format)
- `GET /api/market-prices`
  - Query: `?crop=Tomato&district=Guntur`
  - Returns: List of `{ crop, market, district, state, minPrice, modalPrice, maxPrice, unit, sourceType }`
- `GET /api/market-prices/:crop`

---

## 5. Direct Buyers & FPOs
- `GET /api/buyers`
- `GET /api/buyers/:id`
- `POST /api/buyers/inquiry`
  - Body: `{ recipientId, recipientName, crop, quantity, message }`
- `GET /api/fpos`
- `GET /api/fpos/:id`
- `POST /api/fpos/inquiry`

---

## 6. Cold Storage & Rural Logistics
- `GET /api/storage`
- `POST /api/storage/requests`
  - Body: `{ storageId, crop, quantity, durationMonths }`
- `GET /api/logistics`
- `POST /api/logistics/requests`
  - Body: `{ logisticsId, pickup, destination, crop, quantity }`

---

## 7. Farm-to-Market Decision Engine & Selling
- `POST /api/selling/calculate`
  - Body: `{ crop, quantity, indicativePrice, includeStorage, includeLogistics }`
  - Returns: `{ estimatedGrossValue, estimatedCosts: { storageCost, transportCost, otherCosts, totalCost }, estimatedNetValue, netMarginPercent, disclaimer }`
- `POST /api/selling-requests`
  - Body: `{ crop, quantity, harvestDate, expectedPrice, targetType, buyerName, fpoName, storageName, logisticsName, pickupLocation }`
- `GET /api/selling-requests`
- `GET /api/selling-requests/:id`
- `PUT /api/selling-requests/:id/status`

---

## 8. Offline Synchronization & Admin
- `POST /api/sync/queue`
  - Body: `{ actionType, payload }`
- `GET /api/sync/status`
- `GET /api/admin/stats`
