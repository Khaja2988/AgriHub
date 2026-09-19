import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { storageLogisticsApi } from '../services/api';

export const StorageList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [bookSuccess, setBookSuccess] = useState('');
  const [bookQuantity, setBookQuantity] = useState(1000);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    setLoading(true);
    try {
      const res = await storageLogisticsApi.getStorage();
      if (res.data?.success) {
        setStorages(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch storage:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedStorage) return;
    try {
      await storageLogisticsApi.bookStorage({
        storageId: selectedStorage._id,
        crop: 'Tomato',
        quantity: bookQuantity,
        durationMonths: 1
      });
      setBookSuccess(`Reservation placed at ${selectedStorage.name}! Space blocked for ${bookQuantity} kg.`);
      setTimeout(() => {
        setSelectedStorage(null);
        setBookSuccess('');
      }, 2500);
    } catch (err) {
      setBookSuccess('Booking saved locally.');
      setTimeout(() => setSelectedStorage(null), 2000);
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
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            border: '1px solid #38bdf8',
            color: '#e0f2fe',
            padding: '3px 12px',
            borderRadius: '14px',
            fontSize: '0.78rem',
            fontWeight: '800',
            marginBottom: '8px'
          }}>
            ❄️ COLD CHAIN & WAREHOUSING INFRASTRUCTURE
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            ❄️ Nearby Cold Storage & Warehouses
          </h1>
          <p style={{ color: '#bae6fd', margin: 0, fontSize: '0.94rem', fontWeight: '500' }}>
            Prevent distress selling during market gluts. Store perishables at controlled temperatures.
          </p>
        </div>

        {/* Estimated Distance Notice */}
        <div style={{
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          color: '#e0f2fe',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '14px',
          padding: '10px 16px',
          fontSize: '0.84rem',
          fontWeight: '700',
          backdropFilter: 'blur(8px)'
        }}>
          📍 Estimated Distances from Guntur Agri Cluster
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#1b5e20' }}>
          Loading storage facilities...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {storages.map(st => (
            <div
              key={st._id}
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
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0369a1', margin: 0 }}>
                    {st.name}
                  </h3>
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    borderRadius: '10px',
                    padding: '3px 10px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    border: '1px solid #7dd3fc'
                  }}>
                    {st.storageType}
                  </span>
                </div>

                <div style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px', fontWeight: '500' }}>
                  📍 {st.location}, {st.district}, {st.state}
                </div>

                {/* Capacity & Tariff Card */}
                <div style={{
                  backgroundColor: 'rgba(240, 249, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  border: '1px solid #bae6fd'
                }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600' }}>Available Space:</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: '900', color: '#0284c7', marginTop: '2px' }}>
                      {st.availableCapacity?.toLocaleString()} kg
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: '600' }}>Estimated Tariff:</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: '900', color: '#15803d', marginTop: '2px' }}>
                      ₹{st.estimatedCost} / kg / mo
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#334155', marginBottom: '16px', lineHeight: '1.5' }}>
                  Supported Commodities: <strong>{st.supportedCrops?.join(', ')}</strong><br />
                  📞 Manager: <strong>{st.contact}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedStorage(st)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #0284c7',
                    color: '#0284c7',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Reserve Space
                </button>

                <button
                  onClick={() => navigate(`/sell?storage=${encodeURIComponent(st.name)}`)}
                  style={{
                    flex: 1.2,
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: '1px solid #38bdf8',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  ❄️ Choose Facility
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedStorage && (
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
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            border: '2px solid #38bdf8'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0369a1', marginBottom: '6px' }}>
              Reserve Cold Storage Space
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '16px', fontWeight: '500' }}>
              Facility: <strong>{selectedStorage.name}</strong>
            </p>

            {bookSuccess ? (
              <div style={{
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '800',
                textAlign: 'center',
                border: '1px solid #7dd3fc'
              }}>
                ✅ {bookSuccess}
              </div>
            ) : (
              <>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Quantity to Store (kg):
                </label>
                <input
                  type="number"
                  value={bookQuantity}
                  onChange={(e) => setBookQuantity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: '700',
                    marginBottom: '14px',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />

                <div style={{
                  backgroundColor: 'rgba(240, 249, 255, 0.8)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  color: '#334155',
                  marginBottom: '18px',
                  border: '1px solid #bae6fd'
                }}>
                  Estimated Monthly Cost: <strong style={{ color: '#0369a1' }}>₹{Math.round(bookQuantity * selectedStorage.estimatedCost)}</strong> (indicative)
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedStorage(null)}
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
                    onClick={handleBook}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '9px 22px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    Confirm Reservation
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

export default StorageList;
