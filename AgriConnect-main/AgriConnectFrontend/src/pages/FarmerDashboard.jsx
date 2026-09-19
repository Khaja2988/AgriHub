import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user, farmerProfile } = useAuth();
  const navigate = useNavigate();

  const farmerName = farmerProfile?.name || user?.name || 'రవి కుమార్ (Ravi Kumar)';
  const village = farmerProfile?.village || 'Kaza';
  const district = farmerProfile?.district || 'Guntur';
  const farmSize = farmerProfile?.farmSize || '2 acres';

  const dashboardCards = [
    {
      id: 'ai-advisor',
      path: '/ai-advisor',
      title: t('aiAdvisor'),
      desc: t('aiAdvisorCardDesc'),
      icon: '🤖',
      badge: 'Smart AI Hub',
      badgeColor: '#1b5e20',
      bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)'
    },
    {
      id: 'diagnose',
      path: '/diagnose',
      title: t('cardDiagnoseTitle'),
      desc: t('cardDiagnoseDesc'),
      icon: '🌿',
      badge: 'AI Care',
      badgeColor: '#2e7d32',
      bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
    },
    {
      id: 'treatment',
      path: '/treatment',
      title: t('cardTreatmentTitle'),
      desc: t('cardTreatmentDesc'),
      icon: '💊',
      badge: 'Action Steps',
      badgeColor: '#00796b',
      bgGradient: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'
    },
    {
      id: 'market',
      path: '/market',
      title: t('cardMarketTitle'),
      desc: t('cardMarketDesc'),
      icon: '📊',
      badge: 'e-NAM Prices',
      badgeColor: '#1565c0',
      bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    },
    {
      id: 'buyers',
      path: '/buyers',
      title: t('cardBuyersTitle'),
      desc: t('cardBuyersDesc'),
      icon: '🤝',
      badge: 'Verified Traders',
      badgeColor: '#e65100',
      bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
    },
    {
      id: 'fpos',
      path: '/fpos',
      title: t('cardFposTitle'),
      desc: t('cardFposDesc'),
      icon: '🏛️',
      badge: 'Collective Power',
      badgeColor: '#4a148c',
      bgGradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
    },
    {
      id: 'storage',
      path: '/storage',
      title: t('cardStorageTitle'),
      desc: t('cardStorageDesc'),
      icon: '❄️',
      badge: 'Preserve Harvest',
      badgeColor: '#0277bd',
      bgGradient: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)'
    },
    {
      id: 'logistics',
      path: '/logistics',
      title: t('cardLogisticsTitle'),
      desc: t('cardLogisticsDesc'),
      icon: '🚚',
      badge: 'Rural Transit',
      badgeColor: '#bf360c',
      bgGradient: 'linear-gradient(135deg, #fbe9e7 0%, #ffccbc 100%)'
    },
    {
      id: 'sell',
      path: '/sell',
      title: t('cardSellTitle'),
      desc: t('cardSellDesc'),
      icon: '💰',
      badge: 'Decision Engine',
      badgeColor: '#f57f17',
      bgGradient: 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)'
    },
    {
      id: 'requests',
      path: '/my-requests',
      title: t('cardRequestsTitle'),
      desc: t('cardRequestsDesc'),
      icon: '📋',
      badge: 'Live Status',
      badgeColor: '#37474f',
      bgGradient: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)'
    },
    {
      id: 'profile',
      path: '/profile',
      title: t('cardProfileTitle'),
      desc: t('cardProfileDesc'),
      icon: '👨‍🌾',
      badge: 'Land Details',
      badgeColor: '#33691e',
      bgGradient: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
      {/* Farmer Welcome & Summary Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 38, 20, 0.94) 0%, rgba(27, 94, 32, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '22px 28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        marginBottom: '28px',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        color: '#ffffff'
      }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffffff', marginBottom: '6px', letterSpacing: '-0.3px' }}>
            {t('welcomeFarmer', { name: farmerName })}
          </div>
          <div style={{ fontSize: '0.92rem', color: '#d1fae5', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <span>📍 <strong>{village}, {district}</strong></span>
            <span>🌱 <strong>{farmSize}</strong> (Tomato, Chilli)</span>
            <span style={{ color: '#fef3c7' }}>✅ <strong>Verified Rythu ID</strong></span>
          </div>
        </div>

        {/* Primary CTA: Start Crop Care Journey */}
        <button
          onClick={() => navigate('/diagnose')}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#0f2913',
            border: 'none',
            borderRadius: '24px',
            padding: '12px 26px',
            fontSize: '1rem',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        >
          <span>📸</span> {t('cardDiagnoseTitle')}
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          backgroundColor: 'rgba(14, 38, 20, 0.85)',
          color: '#fef3c7',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '1.15rem',
          fontWeight: '800',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          backdropFilter: 'blur(10px)'
        }}>
          ⚡ {t('quickActions')}
        </span>
      </div>

      {/* 10 Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.path)}
            className="glass-panel"
            style={{
              padding: '22px',
              cursor: 'pointer',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '170px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 14px 28px rgba(0,0,0,0.18)';
              e.currentTarget.style.borderColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.25)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '2.4rem' }}>{card.icon}</span>
                <span style={{
                  backgroundColor: card.badgeColor,
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {card.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1b5e20', marginBottom: '6px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#4b5563', lineHeight: '1.45', margin: 0, fontWeight: '500' }}>
                {card.desc}
              </p>
            </div>

            <div style={{
              marginTop: '16px',
              fontSize: '0.88rem',
              fontWeight: '800',
              color: '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>{t('next')}</span> <span>➔</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
