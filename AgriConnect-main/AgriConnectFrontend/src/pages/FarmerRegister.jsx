import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const FarmerRegister = () => {
  const { t, currentLanguage } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    village: 'Kaza',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    farmSize: '2 acres',
    role: 'FARMER',
    preferredLanguage: currentLanguage
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      navigate('/farmer-dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '30px auto', padding: '0 16px', minHeight: '75vh' }}>
      <div className="glass-panel" style={{
        padding: '32px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🌱</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1b5e20', margin: 0 }}>
            Farmer Registration
          </h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>
            Join AGRIHUB for verified direct procurement and crop care
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ramesh Reddy"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                placeholder="ramesh@krishisetu.in"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                Mobile Number:
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="98480xxxxx"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
              Create Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                Village:
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
                District:
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#1b5e20',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: '800',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Registering...' : 'Complete Farmer Registration ➔'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#666' }}>
          Already registered? <Link to="/login" style={{ color: '#1b5e20', fontWeight: '700' }}>{t('login')} here</Link>
        </div>
      </div>
    </div>
  );
};
