import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { diagnosisApi } from '../services/api';

export const TreatmentGuidance = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const conditionQuery = searchParams.get('condition') || 'Early Blight (Alternaria solani)';

  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatment = async () => {
      setLoading(true);
      try {
        const res = await diagnosisApi.getTreatment(conditionQuery);
        if (res.data?.success) {
          setTreatment(res.data.data);
        }
      } catch (err) {
        // Fallback default
        setTreatment({
          condition: conditionQuery,
          crop: 'Tomato',
          severity: 'Medium',
          symptoms: 'Dark brown concentric ring lesions on older leaves, yellow halo.',
          actionSteps: [
            'Prune and destroy heavily affected lower leaves immediately to stop spore spread.',
            'Water at the base of the plant only; avoid wet foliage.',
            'Ensure proper spacing (60cm x 45cm) and staking for maximum sunlight and airflow.',
            'Apply Copper Oxychloride 50 WP (3g/L) or Mancozeb 75 WP (2g/L) on foliage.',
            'Repeat spray every 7-10 days during humid weather.'
          ],
          prevention: [
            'Practice 2-3 year crop rotation away from solanaceous crops.',
            'Use certified disease-free seeds and apply organic straw mulch.'
          ],
          expertAdvisoryContact: 'Kisan Call Centre: 1800-180-1551 (Toll-free) | Mandal Agriculture Office'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [conditionQuery]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#2e7d32',
          fontSize: '0.9rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>←</span> <span>{t('back')}</span>
      </button>

      {/* Header */}
      <div style={{
        backgroundColor: '#004d40',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,77,64,0.2)'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          🛡️ PRACTICAL CROP PROTECTION ADVISORY
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0' }}>
          {treatment?.condition || conditionQuery}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
          Safe, affordable management practices designed for smallholder farmers.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading treatment advice...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Steps */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #b2dfdb'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#00695c', marginBottom: '16px' }}>
              📋 Immediate Step-by-Step Treatment
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(treatment?.actionSteps || []).map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#f1f8f6',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    borderLeft: '5px solid #00897b'
                  }}
                >
                  <div style={{
                    backgroundColor: '#00695c',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#222', lineHeight: '1.4' }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Long-Term Preventive Practices */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1b5e20', marginBottom: '14px' }}>
              🌱 Long-term Prevention & Cultural Control
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#333', lineHeight: '1.6' }}>
              {(treatment?.prevention || []).map((prev, idx) => (
                <li key={idx} style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                  {prev}
                </li>
              ))}
            </ul>
          </div>

          {/* Expert Extension Officer Advice */}
          <div style={{
            backgroundColor: '#fff8e1',
            borderRadius: '16px',
            padding: '20px',
            border: '2px solid #ffe082',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px'
          }}>
            <span style={{ fontSize: '2.2rem' }}>👨‍🌾</span>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f57f17', margin: '0 0 6px 0' }}>
                When to Seek Agricultural Officer Assistance:
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#444', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                If symptoms spread to more than 25% of your plot or do not improve after 7 days, contact your nearest Mandal Agriculture Officer or Rythu Bharosa Kendram.
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b78103' }}>
                📞 {treatment?.expertAdvisoryContact || 'Kisan Call Centre: 1800-180-1551 (Toll-free, 6 AM to 10 PM)'}
              </div>
            </div>
          </div>

          {/* Proceed to Market Selling CTA */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => navigate('/market')}
              style={{
                backgroundColor: '#2e7d32',
                color: '#ffffff',
                border: 'none',
                borderRadius: '24px',
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
              }}
            >
              📊 Check Mandi Market Prices ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
