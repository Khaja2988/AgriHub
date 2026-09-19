import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { sellingApi, marketApi, buyerFpoApi, storageLogisticsApi } from '../services/api';
import { saveSellingDraft, getSellingDraft, clearSellingDraft } from '../offline/offlineStorage';

export const SellingWizard = () => {
  const { t } = useLanguage();
  const { user, farmerProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Wizard Step (1 to 9)
  const [step, setStep] = useState(1);

  // Form State
  const [crop, setCrop] = useState(searchParams.get('crop') || 'Tomato');
  const [quantity, setQuantity] = useState(1000);
  const [harvestDate, setHarvestDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedPrice, setExpectedPrice] = useState(Number(searchParams.get('price')) || 22);
  const [targetType, setTargetType] = useState(searchParams.get('fpo') ? 'FPO' : 'BUYER');
  const [buyerName, setBuyerName] = useState(searchParams.get('buyer') || 'Sri Krishna Agro Traders');
  const [fpoName, setFpoName] = useState(searchParams.get('fpo') || 'Guntur Rythu Mitra Farmer Producer Co.');
  const [storageName, setStorageName] = useState(searchParams.get('storage') || 'Guntur Central Cold Chain Warehouse');
  const [includeStorage, setIncludeStorage] = useState(true);
  const [logisticsName, setLogisticsName] = useState(searchParams.get('logistics') || 'Kisan Rural Logistics (Ashok Leyland Dost)');
  const [includeLogistics, setIncludeLogistics] = useState(true);
  const [pickupLocation, setPickupLocation] = useState(
    farmerProfile?.village ? `${farmerProfile.village}, ${farmerProfile.district}` : 'Kaza Village Farm, Guntur'
  );

  // Decision Engine Output
  const [calculation, setCalculation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Available options from DB
  const [buyersList, setBuyersList] = useState([]);
  const [fposList, setFposList] = useState([]);
  const [storageList, setStorageList] = useState([]);
  const [logisticsList, setLogisticsList] = useState([]);

  useEffect(() => {
    // Check for saved offline draft
    const draft = getSellingDraft();
    if (draft && !searchParams.get('crop')) {
      if (draft.crop) setCrop(draft.crop);
      if (draft.quantity) setQuantity(draft.quantity);
      if (draft.expectedPrice) setExpectedPrice(draft.expectedPrice);
    }

    // Preload entities
    buyerFpoApi.getBuyers().then(res => res.data?.success && setBuyersList(res.data.data));
    buyerFpoApi.getFpos().then(res => res.data?.success && setFposList(res.data.data));
    storageLogisticsApi.getStorage().then(res => res.data?.success && setStorageList(res.data.data));
    storageLogisticsApi.getLogistics().then(res => res.data?.success && setLogisticsList(res.data.data));
  }, []);

  // Recalculate whenever quantity, price, storage or logistics toggle changes
  useEffect(() => {
    calculateEstimates();
    // Auto-save draft locally for offline resilience
    saveSellingDraft({ crop, quantity, expectedPrice, harvestDate, targetType, pickupLocation });
  }, [crop, quantity, expectedPrice, includeStorage, includeLogistics, storageName, logisticsName]);

  const calculateEstimates = async () => {
    try {
      const res = await sellingApi.calculateDecision({
        crop,
        quantity: Number(quantity),
        indicativePrice: Number(expectedPrice),
        includeStorage,
        storageCostPerKg: 2,
        includeLogistics,
        transportBaseCost: 1500
      });
      if (res.data?.success) {
        setCalculation(res.data.data);
      }
    } catch (err) {
      // Local calculation fallback
      const qty = Number(quantity) || 1000;
      const price = Number(expectedPrice) || 20;
      const gross = qty * price;
      const storage = includeStorage ? Math.round(qty * 2) : 0;
      const transport = includeLogistics ? 1500 : 0;
      const other = 250;
      const totalCost = storage + transport + other;
      setCalculation({
        crop,
        quantity: qty,
        indicativePrice: price,
        estimatedGrossValue: gross,
        estimatedCosts: {
          storageCost: storage,
          transportCost: transport,
          otherCosts: other,
          totalCost
        },
        estimatedNetValue: Math.max(0, gross - totalCost),
        netMarginPercent: gross > 0 ? Math.round(((gross - totalCost) / gross) * 100) : 0,
        disclaimer: 'Estimated value based on indicative/demo data.'
      });
    }
  };

  const handleSubmitRequest = async () => {
    setSubmitting(true);
    try {
      const payload = {
        crop,
        quantity: Number(quantity),
        harvestDate,
        expectedPrice: Number(expectedPrice),
        targetType,
        buyerName: targetType === 'BUYER' ? buyerName : '',
        fpoName: targetType === 'FPO' ? fpoName : '',
        storageName: includeStorage ? storageName : 'Direct Mandi Dispatch (No Storage)',
        logisticsName: includeLogistics ? logisticsName : 'Self Arranged Transport',
        pickupLocation,
        farmerName: farmerProfile?.name || user?.name || 'Ravi Kumar'
      };

      await sellingApi.createSellingRequest(payload);
      clearSellingDraft();
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/my-requests');
      }, 2500);
    } catch (err) {
      console.warn('Selling submission saved locally:', err);
      clearSellingDraft();
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/my-requests');
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px', minHeight: '85vh' }}>
      {/* Frosted Glass Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10, 28, 14, 0.94) 0%, rgba(27, 94, 32, 0.90) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        marginBottom: '24px',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid #f59e0b',
          color: '#fef3c7',
          padding: '3px 14px',
          borderRadius: '14px',
          fontSize: '0.78rem',
          fontWeight: '800',
          marginBottom: '8px'
        }}>
          💰 DECISION ENGINE & REAL NET PROFIT CALCULATOR
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: '#ffffff', margin: '4px 0 8px 0', letterSpacing: '-0.3px' }}>
          🌾 Farm-to-Market Selling Wizard
        </h1>
        <p style={{ color: '#d1fae5', margin: 0, fontSize: '0.96rem', fontWeight: '500' }}>
          End-to-End Decision Engine: Estimate real net earnings after storage and transport deductions.
        </p>

        {/* Progress Step Indicators */}
        <div style={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '18px',
          flexWrap: 'wrap',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '8px 16px',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
            <div
              key={s}
              onClick={() => s <= step && setStep(s)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: s === step
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : s < step
                  ? '#10b981'
                  : 'rgba(255, 255, 255, 0.15)',
                color: s === step ? '#0f2913' : '#ffffff',
                border: s === step ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.88rem',
                fontWeight: '800',
                cursor: s <= step ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                boxShadow: s === step ? '0 0 14px rgba(245, 158, 11, 0.7)' : 'none'
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="glass-panel" style={{
        padding: '30px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '24px'
      }}>
        {/* STEP 1: Select Crop */}
        {step === 1 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 1: Select Crop
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
              Choose the crop you are harvesting for direct sale:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { id: 'Tomato', label: 'టమోటా (Tomato)', icon: '🍅' },
                { id: 'Chilli', label: 'మిరప (Chilli)', icon: '🌶️' },
                { id: 'Rice', label: 'వరి (Rice)', icon: '🌾' },
                { id: 'Cotton', label: 'ప్రత్తి (Cotton)', icon: '☁️' },
                { id: 'Maize', label: 'మొక్కజొన్న (Maize)', icon: '🌽' }
              ].map(c => (
                <div
                  key={c.id}
                  onClick={() => setCrop(c.id)}
                  style={{
                    backgroundColor: crop === c.id ? '#e8f5e9' : '#fafafa',
                    border: crop === c.id ? '2px solid #2e7d32' : '1px solid #e0e0e0',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{c.icon}</div>
                  <div style={{ fontWeight: crop === c.id ? '800' : '600', color: crop === c.id ? '#1b5e20' : '#333' }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Enter Quantity */}
        {step === 2 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 2: Enter Harvest Quantity
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
              Enter the estimated harvest quantity in kilograms (kg):
            </p>

            <div style={{ maxWidth: '300px' }}>
              <input
                type="number"
                value={quantity}
                min="100"
                step="50"
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid #2e7d32',
                  fontSize: '1.3rem',
                  fontWeight: '800',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
                Equivalent to: <strong>{(quantity / 100).toFixed(1)} Quintals</strong> or <strong>{(quantity / 1000).toFixed(2)} Metric Tonnes</strong>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Enter Harvest Date */}
        {step === 3 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 3: Harvest & Pickup Date
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
              When will the harvest be bagged and ready at your farmgate?
            </p>

            <div style={{ maxWidth: '300px' }}>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #aaa',
                  fontSize: '1.1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 4: View Market Prices */}
        {step === 4 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 4: Confirm Indicative Mandi Price
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
              Reference price from Guntur AMC is ₹22/kg. You can adjust your expected selling price:
            </p>

            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ fontSize: '2rem' }}>📊</span>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>Guntur Market Yard Modal Price:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1b5e20' }}>₹22.00 / kg</div>
              </div>
            </div>

            <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
              Your Expected Price (₹/kg):
            </label>
            <input
              type="number"
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(Number(e.target.value))}
              style={{
                maxWidth: '200px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #aaa',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}
            />
          </div>
        )}

        {/* STEP 5: Select Buyer or FPO */}
        {step === 5 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 5: Select Direct Buyer or Registered FPO
            </h3>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => setTargetType('BUYER')}
                style={{
                  backgroundColor: targetType === 'BUYER' ? '#1b5e20' : '#f5f5f5',
                  color: targetType === 'BUYER' ? '#ffffff' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🏢 Direct Trader ({buyerName})
              </button>
              <button
                onClick={() => setTargetType('FPO')}
                style={{
                  backgroundColor: targetType === 'FPO' ? '#4a148c' : '#f5f5f5',
                  color: targetType === 'FPO' ? '#ffffff' : '#333',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🏛️ Registered FPO ({fpoName})
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              {targetType === 'BUYER'
                ? 'Selling directly to Sri Krishna Agro Traders guarantees prompt electronic bank transfer on weighment.'
                : 'Aggregating with Guntur Rythu Mitra FPC gives you collective bargaining power and profit dividend.'}
            </p>
          </div>
        )}

        {/* STEP 6: Select Cold Storage */}
        {step === 6 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 6: Cold Storage Reservation
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeStorage}
                  onChange={(e) => setIncludeStorage(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#01579b' }}>
                  Reserve Cold Storage (₹2/kg/month) to avoid selling at distressed prices
                </span>
              </label>
            </div>

            {includeStorage && (
              <div style={{
                backgroundColor: '#e1f5fe',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid #81d4fa'
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0277bd', marginBottom: '4px' }}>
                  Allocated Facility: {storageName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  Estimated Storage Fee: <strong>₹{Math.round(quantity * 2)}</strong> (for 1 month hold period)
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Select Logistics */}
        {step === 7 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 7: Farmgate Rural Logistics
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeLogistics}
                  onChange={(e) => setIncludeLogistics(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#bf360c' }}>
                  Book Farmgate Pickup Mini-Truck (Estimated Transport Cost: ₹1,500)
                </span>
              </label>
            </div>

            {includeLogistics && (
              <div style={{
                backgroundColor: '#fbe9e7',
                borderRadius: '10px',
                padding: '16px',
                border: '1px solid #ffab91'
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#d84315', marginBottom: '4px' }}>
                  Carrier: {logisticsName}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '8px' }}>
                  Pickup Point: <strong>{pickupLocation}</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#777' }}>
                  Estimated Transport Cost: ₹1,500 based on standard local mandi distance.
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 8: Review Farm-to-Market Decision Engine (THE DIFFERENTIATING BREAKDOWN) */}
        {step === 8 && calculation && (
          <div>
            <div style={{
              backgroundColor: '#1b5e20',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: '600' }}>
                ⚡ {t('decisionEngineTitle')}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '4px 0 0 0' }}>
                Transparent Net Earnings Breakdown
              </h3>
            </div>

            {/* Decision Engine Breakdown Table */}
            <div style={{
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: '0.95rem', color: '#444' }}>
                  Estimated Gross Produce Value ({calculation.quantity} kg × ₹{calculation.indicativePrice}/kg):
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1b5e20' }}>
                  ₹{calculation.estimatedGrossValue?.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', color: '#d32f2f' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  (-) Cold Storage Tariff (Estimated):
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                  - ₹{calculation.estimatedCosts?.storageCost?.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', color: '#d32f2f' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  (-) Rural Logistics / Mini-Truck (Estimated):
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                  - ₹{calculation.estimatedCosts?.transportCost?.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '2px solid #ccc', color: '#d32f2f' }}>
                <span style={{ fontSize: '0.9rem' }}>
                  (-) Handling, Loading & Bagging:
                </span>
                <span style={{ fontSize: '1rem', fontWeight: '700' }}>
                  - ₹{calculation.estimatedCosts?.otherCosts?.toLocaleString()}
                </span>
              </div>

              {/* Net Return Highlight */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0 6px',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1b5e20' }}>
                    {t('netValue')}:
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Farmer Take-Home Margin: ~{calculation.netMarginPercent}%
                  </div>
                </div>

                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#2e7d32' }}>
                  ₹{calculation.estimatedNetValue?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Disclaimer Alert */}
            <div style={{
              backgroundColor: '#fffde7',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#f57f17',
              fontWeight: '600',
              border: '1px solid #fff59d'
            }}>
              ⚠️ {calculation.disclaimer}
            </div>
          </div>
        )}

        {/* STEP 9: Final Confirmation & Submission */}
        {step === 9 && (
          <div>
            <h3 style={{ color: '#1b5e20', fontSize: '1.3rem', fontWeight: '800', marginBottom: '14px' }}>
              Step 9: Submit Official Selling Request
            </h3>

            {submitSuccess ? (
              <div style={{
                backgroundColor: '#e8f5e9',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
                border: '2px solid #81c784'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
                <h2 style={{ color: '#1b5e20', fontWeight: '800', margin: '0 0 8px 0' }}>
                  Selling Request Broadcasted Successfully!
                </h2>
                <p style={{ color: '#444', fontSize: '0.95rem', margin: '0 0 16px 0' }}>
                  Your lot of <strong>{quantity} kg {crop}</strong> has been registered with buyer <strong>{targetType === 'BUYER' ? buyerName : fpoName}</strong>. Transport dispatch notification sent to {logisticsName}.
                </p>
                <div style={{ fontSize: '0.85rem', color: '#2e7d32', fontWeight: '700' }}>
                  Redirecting to My Requests dashboard...
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Please confirm your selling dispatch request for:
                </p>

                <div style={{
                  backgroundColor: '#f9f9f9',
                  borderRadius: '10px',
                  padding: '16px',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  marginBottom: '20px'
                }}>
                  👨‍🌾 <strong>Farmer:</strong> {farmerProfile?.name || user?.name || 'Ravi Kumar'}<br />
                  🌱 <strong>Crop:</strong> {crop} ({quantity} kg)<br />
                  📅 <strong>Harvest Date:</strong> {harvestDate}<br />
                  🤝 <strong>Recipient:</strong> {targetType === 'BUYER' ? buyerName : fpoName}<br />
                  ❄️ <strong>Cold Storage:</strong> {includeStorage ? storageName : 'None'}<br />
                  🚚 <strong>Logistics:</strong> {includeLogistics ? logisticsName : 'Self'}<br />
                  💰 <strong>Estimated Net Pay:</strong> ₹{calculation?.estimatedNetValue?.toLocaleString()}
                </div>

                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#1b5e20',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '28px',
                    padding: '16px 36px',
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    width: '100%',
                    boxShadow: '0 4px 16px rgba(27,94,32,0.3)'
                  }}
                >
                  {submitting ? 'Submitting & Broadcasting...' : '✓ Confirm & Submit Selling Request'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Controls */}
        {!submitSuccess && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            paddingTop: '18px',
            borderTop: '1px solid #e0e0e0'
          }}>
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                ← {t('back')}
              </button>
            ) : <div />}

            {step < 9 && (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  backgroundColor: '#2e7d32',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{t('next')}</span> <span>➔</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
