import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { t } = useLanguage();
  const { startDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleStartDemo = async () => {
    await startDemoLogin();
    navigate('/farmer-dashboard');
  };

  const steps = [
    { num: '1', title: 'Crop Health', desc: 'Capture leaf photo & diagnose blight/pests with AI', icon: '📸' },
    { num: '2', title: 'Treatment', desc: 'Practical, safe non-chemical and certified advisories', icon: '💊' },
    { num: '3', title: 'Market Prices', desc: 'Check e-NAM indicative mandi rates before selling', icon: '📈' },
    { num: '4', title: 'Direct Buyers', desc: 'Connect with verified traders & local FPOs directly', icon: '🤝' },
    { num: '5', title: 'Storage & Logistics', desc: 'Locate cold chains and book rural mini-trucks', icon: '🚚' },
    { num: '6', title: 'Decision Engine', desc: 'Calculate real net earnings and confirm sale', icon: '💰' }
  ];

  return (
    <div style={{ backgroundColor: 'transparent', minHeight: '85vh', paddingBottom: '40px' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(10, 28, 14, 0.94) 0%, rgba(27, 94, 32, 0.90) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: '#ffffff',
        padding: '54px 20px',
        textAlign: 'center',
        borderBottom: '4px solid #f59e0b',
        boxShadow: '0 12px 36px rgba(0,0,0,0.3)'
      }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid #f59e0b',
            color: '#fef3c7',
            padding: '6px 18px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '0.5px'
          }}>
            🌱 ADVANCED AGRITECH PLATFORM FOR INDIAN FARMERS
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            marginBottom: '12px',
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
            color: '#ffffff'
          }}>
            {t('brandName')}
          </h1>

          <p style={{
            fontSize: '1.22rem',
            color: '#d1fae5',
            marginBottom: '28px',
            lineHeight: '1.5',
            fontWeight: '500'
          }}>
            {t('brandSubtitle')}
          </p>

          {/* Big Start Demo Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={handleStartDemo}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0f2913',
                border: 'none',
                borderRadius: '32px',
                padding: '16px 36px',
                fontSize: '1.18rem',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1.0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.45)';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <span>{t('startDemo')} (రవి కుమార్ - Tomato Demo)</span>
            </button>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '16px', fontWeight: '500' }}>
            Instant 1-Click Evaluation: Takes 3 minutes through the complete farmer journey.
          </p>
        </div>
      </section>

      {/* End-to-End Farmer Journey Flow */}
      <section style={{ maxWidth: '1240px', margin: '40px auto 20px', padding: '0 20px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          background: 'rgba(10, 28, 14, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '16px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          display: 'inline-block',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <h2 style={{ fontSize: '1.9rem', color: '#fef3c7', fontWeight: '900', margin: '0 0 6px' }}>
            The Complete Farmer Journey
          </h2>
          <p style={{ color: '#d1fae5', fontSize: '1rem', margin: 0, fontWeight: '500' }}>
            From crop disease diagnosis to direct market monetization without middleman cuts
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '18px'
        }}>
          {steps.map(step => (
            <div
              key={step.num}
              className="glass-panel"
              style={{
                padding: '24px 18px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.25s ease'
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
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.9rem',
                marginBottom: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                {step.icon}
              </div>
              <div style={{
                background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '3px 10px',
                marginBottom: '8px',
                border: '1px solid #f59e0b'
              }}>
                STEP {step.num}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1b5e20', marginBottom: '6px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: '1.45', margin: 0, fontWeight: '500' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiating Highlights */}
      <section style={{ maxWidth: '1240px', margin: '40px auto 10px', padding: '0 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 28, 14, 0.94) 0%, rgba(27, 94, 32, 0.92) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '34px',
          border: '1.5px solid #f59e0b',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '28px',
          color: '#ffffff'
        }}>
          <div>
            <h3 style={{ color: '#fef3c7', fontSize: '1.3rem', fontWeight: '900', marginBottom: '10px' }}>
              🎯 Farm-to-Market Decision Engine
            </h3>
            <p style={{ color: '#d1fae5', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Unlike simple listing directories, AGRIHUB computes estimated net take-home earnings by subtracting real cold-storage tariffs and logistics freight from indicative market prices before the farmer commits.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fef3c7', fontSize: '1.3rem', fontWeight: '900', marginBottom: '10px' }}>
              📡 Rural Offline Resilience
            </h3>
            <p style={{ color: '#d1fae5', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Built for intermittent 2G/3G connectivity in rural areas. Diagnosis logs, selling drafts, and crop advisories remain locally cached and synchronize automatically when network connection resumes.
            </p>
          </div>

          <div>
            <h3 style={{ color: '#fef3c7', fontSize: '1.3rem', fontWeight: '900', marginBottom: '10px' }}>
              🗣️ Localized for Farmers
            </h3>
            <p style={{ color: '#d1fae5', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              Full localization in Telugu (తెలుగు), Hindi (हिन्दी), and English with high-contrast typography, large touch targets, and voice/audio readability tailored for basic smartphones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
