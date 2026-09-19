import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { farmerApi } from '../services/api';

export const FarmerProfile = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { user, farmerProfile, setFarmerProfile } = useAuth();

  const [name, setName] = useState(farmerProfile?.name || user?.name || 'Ravi Kumar');
  const [phone, setPhone] = useState(farmerProfile?.phone || user?.phone || '9848012345');
  const [village, setVillage] = useState(farmerProfile?.village || 'Kaza');
  const [district, setDistrict] = useState(farmerProfile?.district || 'Guntur');
  const [state, setState] = useState(farmerProfile?.state || 'Andhra Pradesh');
  const [farmSize, setFarmSize] = useState(farmerProfile?.farmSize || '2 acres');
  const [cropsGrown, setCropsGrown] = useState((farmerProfile?.cropsGrown || ['Tomato', 'Chilli']).join(', '));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        name,
        phone,
        village,
        district,
        state,
        farmSize,
        cropsGrown: cropsGrown.split(',').map(c => c.trim()).filter(Boolean),
        preferredLanguage: currentLanguage
      };
      await farmerApi.updateProfile(payload);
      setFarmerProfile(payload);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      // Local fallback
      const updated = {
        name,
        phone,
        village,
        district,
        state,
        farmSize,
        cropsGrown: cropsGrown.split(',').map(c => c.trim()),
        preferredLanguage: currentLanguage
      };
      setFarmerProfile(updated);
      setMessage('Profile updated locally.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
      <div className="glass-panel" style={{
        padding: '32px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '50%',
            width: '58px',
            height: '58px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 12px rgba(27, 94, 32, 0.3)'
          }}>
            👨‍🌾
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1b5e20', margin: 0, letterSpacing: '-0.3px' }}>
              {t('profile')}
            </h1>
            <p style={{ color: '#4b5563', margin: '3px 0 0 0', fontSize: '0.92rem', fontWeight: '500' }}>
              Your agricultural identity and landholding records
            </p>
          </div>
        </div>

        {message && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            ✅ {message}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
              Farmer Full Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
                Contact Mobile Number:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
                Farm Land Size:
              </label>
              <input
                type="text"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
                Village:
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
                District:
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
                State:
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
              Crops Grown (comma-separated):
            </label>
            <input
              type="text"
              value={cropsGrown}
              onChange={(e) => setCropsGrown(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '6px' }}>
              Preferred App Language:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { code: 'te', label: 'తెలుగు (Telugu)' },
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' }
              ].map(l => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => changeLanguage(l.code)}
                  style={{
                    backgroundColor: currentLanguage === l.code ? '#2e7d32' : '#f5f5f5',
                    color: currentLanguage === l.code ? '#ffffff' : '#333',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: '#1b5e20',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '12px'
            }}
          >
            {saving ? 'Saving...' : '💾 Save Profile Details'}
          </button>
        </form>
      </div>
    </div>
  );
};
