import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const FarmerLogin = () => {
  const { t } = useLanguage();
  const { login, startDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/farmer-dashboard');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async () => {
    await startDemoLogin();
    navigate('/farmer-dashboard');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto', padding: '0 16px', minHeight: '75vh' }}>
      <div className="glass-panel" style={{
        padding: '34px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.22)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🌾</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1b5e20', margin: 0 }}>
            {t('login')} to {t('brandName')}
          </h2>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>
            Empowering farmers with smart crop care & direct markets
          </p>
        </div>

        {/* 1-Click Demo Evaluation Button */}
        <div style={{
          backgroundColor: '#fff8e1',
          border: '2px dashed #ffb300',
          borderRadius: '12px',
          padding: '14px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#b78103', marginBottom: '8px' }}>
            HACKATHON EVALUATOR SHORTCUT
          </div>
          <button
            onClick={handleDemoLogin}
            type="button"
            style={{
              backgroundColor: '#ffb300',
              color: '#1a237e',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              fontWeight: '800',
              fontSize: '0.9rem',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>⚡</span> Login as Ravi Kumar (Demo Account)
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#aaa', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
          <span style={{ padding: '0 10px' }}>OR LOGIN WITH CREDENTIALS</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
        </div>

        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
              Email or Phone:
            </label>
            <input
              type="email"
              value={email}
              placeholder="e.g. ravi.kumar@krishisetu.in"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#333', marginBottom: '4px' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
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
              marginTop: '8px'
            }}
          >
            {loading ? 'Logging in...' : t('login')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#1b5e20', fontWeight: '700' }}>{t('register')} here</Link>
        </div>
      </div>
    </div>
  );
};
