import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer style={{
      backgroundColor: 'rgba(10, 26, 13, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: '#e8f5e9',
      padding: '36px 16px 24px',
      marginTop: 'auto',
      borderTop: '3px solid #f59e0b'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>🌾</span>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#a5d6a7' }}>
              {t('brandName')}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#c8e6c9', lineHeight: '1.5' }}>
            {t('brandSubtitle')}. Transforming smallholder farming from fragmented crop care to transparent direct market access.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>
            👨‍🌾 Farmer Support & Advisory
          </h4>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
            📞 <strong>Kisan Call Centre:</strong> 1800-180-1551 (Toll Free)<br />
            🏛️ <strong>Andhra Pradesh RBK Helpline:</strong> 155251<br />
            🌱 <strong>Advisory Hours:</strong> 6:00 AM - 10:00 PM (All 22 Regional Languages)
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '10px' }}>
            📡 Transparency & Compliance
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#a5d6a7', lineHeight: '1.5' }}>
            AGRIHUB is aligned with national digital agriculture frameworks (e-NAM, PM-AASHA, and FPO aggregation guidelines). Indicative rates and AI-assisted diagnoses are illustrative aids and do not constitute financial or chemical guarantees.
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#81c784'
      }}>
        © {new Date().getFullYear()} AGRIHUB. Smart Crop Care & Direct Market Access for Small and Marginal Farmers.
      </div>
    </footer>
  );
};
