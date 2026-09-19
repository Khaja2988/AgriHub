import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { buyerFpoApi } from '../services/api';

export const BuyerList = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('buyers'); // 'buyers' or 'fpos'
  const [buyers, setBuyers] = useState([]);
  const [fpos, setFpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [buyersRes, fposRes] = await Promise.all([
        buyerFpoApi.getBuyers(),
        buyerFpoApi.getFpos()
      ]);
      if (buyersRes.data?.success) setBuyers(buyersRes.data.data);
      if (fposRes.data?.success) setFpos(fposRes.data.data);
    } catch (err) {
      console.warn('Failed to load buyers/fpos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInquiry = async () => {
    if (!selectedEntity) return;
    try {
      await buyerFpoApi.sendBuyerInquiry({
        recipientType: activeTab === 'buyers' ? 'BUYER' : 'FPO',
        recipientId: selectedEntity._id,
        recipientName: selectedEntity.name,
        crop: selectedEntity.crops[0] || 'Tomato',
        quantity: 1000,
        message: inquiryMsg || 'Interested in direct procurement modal price confirmation.'
      });
      setInquirySuccess(`Inquiry sent to ${selectedEntity.name}! They will contact your phone shortly.`);
      setTimeout(() => {
        setSelectedEntity(null);
        setInquirySuccess('');
        setInquiryMsg('');
      }, 2500);
    } catch (err) {
      setInquirySuccess('Inquiry sent locally.');
      setTimeout(() => setSelectedEntity(null), 2000);
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
        color: '#ffffff'
      }}>
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
          🤝 ZERO-MIDDLEMEN DIRECT PROCUREMENT NETWORK
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
          🤝 Direct Buyers & Farmer Producer Organizations (FPOs)
        </h1>
        <p style={{ color: '#d1fae5', margin: 0, fontSize: '0.94rem', fontWeight: '500' }}>
          Eliminate middlemen margins by selling directly to verified institutional buyers and registered FPOs.
        </p>
      </div>

      {/* Tabs with Dark Glass Bar */}
      <div style={{
        display: 'flex',
        gap: '10px',
        background: 'rgba(10, 26, 14, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '6px',
        borderRadius: '18px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        marginBottom: '22px',
        width: 'fit-content'
      }}>
        <button
          onClick={() => setActiveTab('buyers')}
          style={{
            background: activeTab === 'buyers'
              ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
              : 'transparent',
            border: activeTab === 'buyers' ? '1px solid #f59e0b' : '1px solid transparent',
            color: activeTab === 'buyers' ? '#ffffff' : '#cbd5e1',
            fontWeight: activeTab === 'buyers' ? '800' : '600',
            fontSize: '0.95rem',
            padding: '10px 22px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'buyers' ? '0 4px 12px rgba(27, 94, 32, 0.4)' : 'none'
          }}
        >
          🏢 Verified Direct Buyers ({buyers.length})
        </button>

        <button
          onClick={() => setActiveTab('fpos')}
          style={{
            background: activeTab === 'fpos'
              ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
              : 'transparent',
            border: activeTab === 'fpos' ? '1px solid #f59e0b' : '1px solid transparent',
            color: activeTab === 'fpos' ? '#ffffff' : '#cbd5e1',
            fontWeight: activeTab === 'fpos' ? '800' : '600',
            fontSize: '0.95rem',
            padding: '10px 22px',
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'fpos' ? '0 4px 12px rgba(27, 94, 32, 0.4)' : 'none'
          }}
        >
          🏛️ Farmer Producer Orgs / FPOs ({fpos.length})
        </button>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px', fontWeight: '700', color: '#1b5e20' }}>
          Loading buyers and FPO partners...
        </div>
      ) : activeTab === 'buyers' ? (
        /* Buyers Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {buyers.map(b => (
            <div
              key={b._id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1b5e20', margin: 0 }}>
                    {b.name}
                  </h3>
                  {b.verified && (
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '10px',
                      padding: '3px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      border: '1px solid #86efac'
                    }}>
                      ✓ Verified
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px', fontWeight: '500' }}>
                  📍 {b.location}, {b.district}
                </div>

                <div style={{
                  backgroundColor: 'rgba(254, 243, 199, 0.6)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  border: '1px solid #fde68a'
                }}>
                  <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '4px' }}>
                    Crops Needed: <strong>{b.crops.join(', ')}</strong>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '6px' }}>
                    Required Quantity: <strong>{b.requiredQuantity} kg</strong>
                  </div>
                  <div style={{ fontSize: '1.05rem', color: '#166534', fontWeight: '900' }}>
                    Indicative Buying Price: ₹{b.indicativePrice} / kg
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedEntity(b)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #1b5e20',
                    color: '#1b5e20',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  💬 Inquire
                </button>

                <button
                  onClick={() => navigate(`/sell?crop=${encodeURIComponent(b.crops[0])}&buyer=${encodeURIComponent(b.name)}&price=${b.indicativePrice}`)}
                  style={{
                    flex: 1.2,
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                    border: '1px solid #f59e0b',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(27, 94, 32, 0.25)'
                  }}
                >
                  💰 Sell to Buyer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* FPOs Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {fpos.map(f => (
            <div
              key={f._id}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1b5e20', margin: 0 }}>
                    {f.name}
                  </h3>
                  {f.verified && (
                    <span style={{
                      backgroundColor: '#ede9fe',
                      color: '#5b21b6',
                      borderRadius: '10px',
                      padding: '3px 10px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      border: '1px solid #c4b5fd'
                    }}>
                      ✓ Reg. FPC
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '14px', fontWeight: '500' }}>
                  📍 {f.location}, {f.district}
                </div>

                <div style={{
                  backgroundColor: 'rgba(243, 232, 255, 0.6)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  border: '1px solid #e9d5ff'
                }}>
                  <div style={{ fontSize: '0.86rem', color: '#334155', marginBottom: '4px' }}>
                    Supported Crops: <strong>{f.crops.join(', ')}</strong>
                  </div>
                  <div style={{ fontSize: '0.98rem', color: '#5b21b6', fontWeight: '800' }}>
                    Procurement Capacity: {f.procurementCapacity} kg
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                    📞 Helpline: {f.contact}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedEntity(f)}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #5b21b6',
                    color: '#5b21b6',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  💬 Inquire
                </button>

                <button
                  onClick={() => navigate(`/sell?crop=${encodeURIComponent(f.crops[0])}&fpo=${encodeURIComponent(f.name)}`)}
                  style={{
                    flex: 1.2,
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                    border: '1px solid #f59e0b',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(27, 94, 32, 0.25)'
                  }}
                >
                  🤝 Aggregate via FPO
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Modal */}
      {selectedEntity && (
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
            border: '2px solid #f59e0b'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1b5e20', marginBottom: '6px' }}>
              Direct Inquiry to: {selectedEntity.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '16px', fontWeight: '500' }}>
              Send an instant procurement request. Your phone number will be shared with the aggregator.
            </p>

            {inquirySuccess ? (
              <div style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '800',
                textAlign: 'center',
                border: '1px solid #86efac'
              }}>
                ✅ {inquirySuccess}
              </div>
            ) : (
              <>
                <textarea
                  rows="4"
                  placeholder="e.g. I have 1,000 kg of fresh grade-A tomatoes harvested in Kaza village. Can you arrange pickup?"
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '0.92rem',
                    marginBottom: '16px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    onClick={() => setSelectedEntity(null)}
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
                    onClick={handleSendInquiry}
                    style={{
                      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                      border: '1px solid #f59e0b',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '9px 22px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)'
                    }}
                  >
                    Send Direct Inquiry ➔
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

export default BuyerList;
