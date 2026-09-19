import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { marketApi } from '../services/api';

export const MarketPrices = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, [selectedCrop]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = selectedCrop ? { crop: selectedCrop } : {};
      const res = await marketApi.getPrices(params);
      if (res.data?.success) {
        setPrices(res.data.data);
      }
    } catch (err) {
      console.warn('Market price fetch failed, using fallback data:', err);
    } finally {
      setLoading(false);
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
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            color: '#fef3c7',
            padding: '3px 12px',
            borderRadius: '14px',
            fontSize: '0.78rem',
            fontWeight: '800',
            marginBottom: '8px'
          }}>
            📈 LIVE e-NAM MANDI MARKET RATES
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            📊 {t('marketTitle')}
          </h1>
          <p style={{ color: '#d1fae5', margin: 0, fontSize: '0.94rem', fontWeight: '500' }}>
            Real-time reference rates across major APMCs and regional mandis.
          </p>
        </div>

        {/* Indicative Notice Badge */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.18)',
          color: '#fef3c7',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '14px',
          padding: '10px 16px',
          fontSize: '0.84rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(8px)'
        }}>
          <span>ℹ️</span>
          <span>Indicative / Demo Market Data (e-NAM Format)</span>
        </div>
      </div>

      {/* Filter Bar with Glassmorphism */}
      <div className="glass-panel" style={{
        padding: '14px 20px',
        marginBottom: '22px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        border: '1px solid rgba(245, 158, 11, 0.25)'
      }}>
        <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#1b5e20' }}>Filter by Crop:</span>
        {['', 'Tomato', 'Chilli', 'Rice', 'Cotton'].map(c => (
          <button
            key={c}
            onClick={() => setSelectedCrop(c)}
            style={{
              background: selectedCrop === c
                ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
                : 'rgba(255, 255, 255, 0.85)',
              color: selectedCrop === c ? '#ffffff' : '#333333',
              border: selectedCrop === c ? '1px solid #f59e0b' : '1px solid #d1d5db',
              borderRadius: '20px',
              padding: '7px 18px',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedCrop === c ? '0 4px 12px rgba(27, 94, 32, 0.3)' : 'none'
            }}
          >
            {c === '' ? 'All Crops' : c}
          </button>
        ))}
      </div>

      {/* Price Cards */}
      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#1b5e20' }}>
          Loading market prices...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {prices.map((p, idx) => (
            <div
              key={p._id || idx}
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
                e.currentTarget.style.borderColor = '#f59e0b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1b5e20' }}>
                    {p.crop}
                  </span>
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderRadius: '10px',
                    padding: '3px 10px',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    border: '1px solid #86efac'
                  }}>
                    {p.district}, {p.state}
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '16px', fontWeight: '600' }}>
                  🏛️ {p.market}
                </div>

                {/* Price Spectrum */}
                <div style={{
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.2fr 1fr',
                  textAlign: 'center',
                  gap: '8px',
                  marginBottom: '18px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Min</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#475569', marginTop: '2px' }}>
                      ₹{p.minPrice}
                    </div>
                  </div>

                  <div style={{ borderLeft: '1px solid #cbd5e1', borderRight: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: '800' }}>Modal Avg</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#166534', marginTop: '2px' }}>
                      ₹{p.modalPrice}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Max</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#475569', marginTop: '2px' }}>
                      ₹{p.maxPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Directly Sell with Decision Engine */}
              <button
                onClick={() => navigate(`/sell?crop=${encodeURIComponent(p.crop)}&price=${p.modalPrice}`)}
                style={{
                  background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                  color: '#ffffff',
                  border: '1px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '11px',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                  boxShadow: '0 4px 12px rgba(27, 94, 32, 0.25)'
                }}
              >
                <span>💰</span>
                <span>Lock & Sell at this Rate</span>
                <span>➔</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketPrices;
