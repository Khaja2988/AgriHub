import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// Offline Banner
import { OfflineBanner } from './offline/OfflineBanner';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// KrishiSetu Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { CropDiagnosis } from './pages/CropDiagnosis';
import { TreatmentGuidance } from './pages/TreatmentGuidance';
import { MarketPrices } from './pages/MarketPrices';
import { BuyerList } from './pages/BuyerList';
import { StorageList } from './pages/StorageList';
import { LogisticsList } from './pages/LogisticsList';
import { SellingWizard } from './pages/SellingWizard';
import { SellingRequests } from './pages/SellingRequests';
import { FarmerProfile } from './pages/FarmerProfile';
import { FarmerLogin } from './pages/FarmerLogin';
import { FarmerRegister } from './pages/FarmerRegister';
import { AdminDashboard } from './pages/AdminDashboard';
import { AiAssistant } from './pages/AiAssistant';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'transparent' }}>
          {/* Real-time Network / Offline Sync Banner */}
          <OfflineBanner />

          {/* KrishiSetu Navigation Bar */}
          <Navbar />

          {/* Main Routing Body */}
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Home / Landing */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<LandingPage />} />

              {/* Farmer Dashboard */}
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />

              {/* Crop Care & Diagnosis */}
              <Route path="/diagnose" element={<CropDiagnosis />} />
              <Route path="/diagnosis" element={<CropDiagnosis />} />
              <Route path="/treatment" element={<TreatmentGuidance />} />
              <Route path="/ai-advisor" element={<AiAssistant />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />

              {/* Direct Market Access */}
              <Route path="/market" element={<MarketPrices />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/buyers" element={<BuyerList />} />
              <Route path="/fpos" element={<BuyerList />} />

              {/* Post-Harvest Storage & Rural Transport */}
              <Route path="/storage" element={<StorageList />} />
              <Route path="/logistics" element={<LogisticsList />} />

              {/* Farm-to-Market Decision Engine & Selling Wizard */}
              <Route path="/sell" element={<SellingWizard />} />
              <Route path="/selling-wizard" element={<SellingWizard />} />
              <Route path="/my-requests" element={<SellingRequests />} />

              {/* User Profiles & Auth */}
              <Route path="/profile" element={<FarmerProfile />} />
              <Route path="/login" element={<FarmerLogin />} />
              <Route path="/farmerlogin" element={<FarmerLogin />} />
              <Route path="/register" element={<FarmerRegister />} />
              <Route path="/farmerregistration" element={<FarmerRegister />} />

              {/* Administration */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Catch-all fallback to Landing Page */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast notifications */}
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
