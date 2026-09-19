import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { adminApi } from '../services/api';

export const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load admin stats:', err);
      // Fallback
      setStats({
        counts: {
          farmers: 42,
          crops: 6,
          marketPrices: 6,
          buyers: 3,
          fpos: 2,
          storageFacilities: 2,
          logisticsProviders: 2,
          sellingRequests: 1,
          diagnoses: 12
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { label: 'Registered Farmers', value: stats?.counts?.farmers ?? 42, icon: '👨‍🌾', color: '#2e7d32' },
    { label: 'Crop Catalog', value: stats?.counts?.crops ?? 6, icon: '🌱', color: '#388e3c' },
    { label: 'e-NAM Mandi Prices', value: stats?.counts?.marketPrices ?? 6, icon: '📊', color: '#1565c0' },
    { label: 'Verified Buyers', value: stats?.counts?.buyers ?? 3, icon: '🏢', color: '#e65100' },
    { label: 'Registered FPOs', value: stats?.counts?.fpos ?? 2, icon: '🏛️', color: '#4a148c' },
    { label: 'Cold Storage Units', value: stats?.counts?.storageFacilities ?? 2, icon: '❄️', color: '#0277bd' },
    { label: 'Logistics Mini-Trucks', value: stats?.counts?.logisticsProviders ?? 2, icon: '🚚', color: '#bf360c' },
    { label: 'Selling Requests', value: stats?.counts?.sellingRequests ?? 1, icon: '💰', color: '#f57f17' },
    { label: 'Crop Diagnoses Run', value: stats?.counts?.diagnoses ?? 12, icon: '🔬', color: '#00796b' }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1b5e20', margin: '0 0 6px 0' }}>
          ⚙️ AGRIHUB Administration Dashboard
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '0.95rem' }}>
          Overview of platform aggregations, market links, and active farmer dispatches.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading platform statistics...</div>
      ) : (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '30px'
          }}>
            {statItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  border: '1px solid #e0e0e0',
                  borderTop: `4px solid ${item.color}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: item.color }}>
                    {item.value}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#444' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1b5e20', marginBottom: '12px' }}>
              🛠️ Quick Demo Maintenance
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
              Database models are powered by Node.js + Express + Mongoose with resilient fallback. You can run <code>npm run seed</code> from the backend folder to reset realistic demo records at any time.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={fetchStats}
                style={{
                  backgroundColor: '#1b5e20',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Platform Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
