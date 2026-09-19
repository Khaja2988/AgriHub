# AGRIHUB - Architecture and Technical Design

## 1. High-Level Architecture

```mermaid
graph TD
    subgraph Frontend [React.js + Vite Client]
        UI[Farmer-First Responsive UI]
        LangCtx[LanguageContext: TE / HI / EN]
        AuthCtx[AuthContext: JWT & Demo State]
        OfflineSync[OfflineBanner & LocalStorage Cache]
    end

    subgraph Backend [Node.js + Express Server - Port 5000]
        Router[Express REST APIs]
        AuthMW[JWT Auth Middleware]
        UploadMW[Multer Image Upload]
        DecEngine[Farm-to-Market Decision Engine]
        
        subgraph DiagnosisSubsystem [Diagnosis Architecture]
            DiagService[Diagnosis Service]
            DemoProvider[DemoDiagnosisProvider]
            MLProvider[MLDiagnosisProvider / CV Service]
        end
    end

    subgraph Database [Persistence Layer]
        Atlas[(MongoDB Atlas Cluster / Local)]
        MockDB[(Resilient In-Memory Fallback)]
    end

    UI --> Router
    Router --> DiagService
    DiagService --> DemoProvider
    DiagService -.-> MLProvider
    Router --> DecEngine
    Router --> Atlas
    Atlas -. Fallback .-> MockDB
```

## 2. Technology Stack
- **Frontend Framework:** React 18, Vite 5, React Router v6.
- **Styling & UI:** Responsive CSS, Material UI icons, Bootstrap utility classes, Inter typography.
- **State & Caching:** React Context, LocalStorage / IndexedDB for offline drafts and diagnoses.
- **Backend Runtime:** Node.js v23, Express.js 4.
- **Data Persistence:** MongoDB 8, Mongoose ODM with resilient connection pooling.
- **File Uploads:** Multer with strict image MIME validation (JPEG, PNG, WEBP) and 10MB size cap.
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs salted hashing.

## 3. Diagnosis Provider Pattern
To adhere strictly to hackathon guidelines and prevent fabricated claims of scientific model accuracy:
```
DiagnosisProvider (Abstract Base)
  ├── DemoDiagnosisProvider (Pre-programmed agronomic knowledge with clear demo disclaimer)
  └── MLDiagnosisProvider (Pluggable interface for TensorFlow / ONNX / FastAPI microservices)
```
The frontend interacts exclusively with `POST /api/diagnosis` regardless of which underlying provider is active.

## 4. Offline Resilience Architecture
- `navigator.onLine` listener powers `<OfflineBanner />`.
- Selling drafts are saved to `localStorage.agrihub_selling_draft` on every keystroke.
- Queued actions during network outages are posted to `POST /api/sync/queue` upon reconnect.
