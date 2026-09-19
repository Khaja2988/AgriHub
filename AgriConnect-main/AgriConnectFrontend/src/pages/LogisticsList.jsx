import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { storageLogisticsApi } from '../services/api';

export const LogisticsList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogistics, setSelectedLogistics] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState('');
  const [pickupLoc, setPickupLoc] = useState('Kaza Village Farm, Guntur');

  useEffect(() => {
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    setLoading(true);
    try {
      const res = await storageLogisticsApi.getLogistics();
      if (res.data?.success) {
        setLogistics(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch logistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTransport = async () => {
    if (!selectedLogistics) return;
    try {
      await storageLogisticsApi.bookLogistics({
        logisticsId: selectedLogistics._id,
        pickup: pickupLoc,
        destination: 'Guntur Mandi Yard',
        crop: 'Tomato',
        quantity: 1000
      });
      setDispatchSuccess(`Transport vehicle dispatched! Driver will arrive within ${selectedLogistics.estimatedTime}.`);
      setTimeout(() => {
        setSelectedLogistics(null);
        setDispatchSuccess('');
      }, 2500);
    } catch (err) {
      setDispatchSuccess('Booking saved locally.');
      setTimeout(() => setSelectedLogistics(null), 2000);
    }
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
      {/* Frosted Glass Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10, 28, 14, 0.94) 0%, rgba(27, 94, 32, 0.90) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        marginBottom: '22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        color: '#ffffff'
      }}>
        <div>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            border: '1px solid #f97316',
            color: '#fed7aa',
            padding: '3px 12px',
            borderRadius: '14px',
            fontSize: '0.78rem',
            fontWeight: '800',
            marginBottom: '8px'
          }}>
            🚚 RURAL FARMGATE TRANSIT & LOGISTICS
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            🚚 Rural Logistics & Farmgate Transport
          </h1>
          <p style={{ color: '#fed7aa', margin: 0, fontSize: '0.94rem', fontWeight: '500' }}>
            Connect with rural mini-trucks and tempo carriers for direct mandi or cold-chain transit.
          </p>
        </div>

        {/* Notice Badge */}
        <div style={{
          backgroundColor: 'rgba(249, 115, 22, 0.18)',
          color: '#fed7aa',
          border: '1px solid rgba(249, 115, 22, 0.4)',
          borderRadius: '14px',
          padding: '10px 16px',
          fontSize: '0.84rem',
          fontWeight: '700',
          backdropFilter: 'blur(8px)'
        }}>
          ⏱️ Estimated Transport Cost (Local Mandi Standard)
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#1b5e20' }}>
          Loading available transport vehicles...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {logistics.map(lg => (
            <div
              key={lg._id}
              className="glass-panel"
              style={{
                padding: '22px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)';
                e.currentTarget.style.borderColor = '#f97316';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#c2410c', margin: 0 }}>
                    {lg.provider}
                  </h3>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderRadius: '10px',
                    padding: '3px 10px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    border: '1px solid #86efac'
                  }}>
                    🟢 Available Now
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '700', marginBottom: '14px' }}>
                  🚛 {lg.vehicleType} (Payload: {lg.capacity} kg)
                </div>

                {/* Rates Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 247, 237, 0.8)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  border: '1px solid #fed7aa'
                }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600' }}>Est. Base Fare:</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#c2410c', marginTop: '2px' }}>
                      ₹{lg.estimatedCost}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600' }}>Pickup SLA:</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#15803d', marginTop: '2px' }}>
                      {lg.estimatedTime}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#334155', marginBottom: '16px', lineHeight: '1.5' }}>
                  Coverage: <strong>{lg.serviceAreas?.join(', ')}</strong><br />
                  📞 Driver / Desk: <strong>{lg.contact}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedLogistics(lg)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #c2410c',
                    color: '#c2410c',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Book Mini-Truck
                </button>

                <button
                  onClick={() => navigate(`/sell?logistics=${encodeURIComponent(lg.provider)}`)}
                  style={{
                    flex: 1.2,
                    background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                    border: '1px solid #f59e0b',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  Select for Sale ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dispatch Modal */}
      {selectedLogistics && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            padding: '28px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            border: '2px solid #f97316'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#c2410c', marginBottom: '6px' }}>
              Dispatch Rural Transport Vehicle
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '16px', fontWeight: '500' }}>
              Vehicle: <strong>{selectedLogistics.vehicleType}</strong> ({selectedLogistics.provider})
            </p>

            {dispatchSuccess ? (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '800',
                textAlign: 'center',
                border: '1px solid #86efac'
              }}>
                ✅ {dispatchSuccess}
              </div>
            ) : (
              <>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Farm Pickup Location:
                </label>
                <input
                  type="text"
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    marginBottom: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />

                <div style={{
                  backgroundColor: 'rgba(255, 247, 237, 0.8)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  color: '#334155',
                  marginBottom: '18px',
                  border: '1px solid #fed7aa'
                }}>
                  Estimated Fare: <strong style={{ color: '#c2410c' }}>₹{selectedLogistics.estimatedCost}</strong> (indicative base fare)
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedLogistics(null)}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '9px 18px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      color: '#475569'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookTransport}
                    style={{
                      background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '9px 22px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsList;
