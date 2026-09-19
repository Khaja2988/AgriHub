import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout, startDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDemoClick = async () => {
    await startDemoLogin();
    navigate('/farmer-dashboard');
  };

  const navLinks = [
    { to: '/farmer-dashboard', label: t('home') },
    { to: '/ai-advisor', label: t('aiAdvisor') || '🤖 AI Advisor' },
    { to: '/diagnose', label: t('diagnose') },
    { to: '/treatment', label: t('treatment') },
    { to: '/market', label: t('market') },
    { to: '/buyers', label: t('buyersFpos') },
    { to: '/storage', label: t('storage') },
    { to: '/logistics', label: t('logistics') },
    { to: '/sell', label: t('sellProduce') },
    { to: '/my-requests', label: t('myRequests') },
  ];

  return (
    <header style={{
      backgroundColor: 'rgba(14, 36, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: '#ffffff',
      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)'
    }}>
      {/* Top Banner / Brand */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo and App Title */}
        <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>🌾</span>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.5px' }}>
              {t('brandName')}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: '400' }}>
              {t('brandSubtitle')}
            </div>
          </div>
        </Link>

        {/* Quick controls: Start Demo, Language Switcher, Profile/Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Start Demo Button */}
          <button
            onClick={handleDemoClick}
            style={{
              backgroundColor: '#ffb300',
              color: '#1a237e',
              border: 'none',
              borderRadius: '24px',
              padding: '8px 18px',
              fontWeight: '800',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚡</span> {t('startDemo')}
          </button>

          {/* Language Selector */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '20px',
            padding: '2px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            {[
              { code: 'te', label: 'తెలుగు' },
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  background: currentLanguage === lang.code ? '#ffffff' : 'transparent',
                  color: currentLanguage === lang.code ? '#1b5e20' : '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  fontWeight: currentLanguage === lang.code ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* User Account or Login button */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to="/profile"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                👤 {user?.name || 'రవి కుమార్'}
              </Link>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to="/login"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1b5e20',
                  padding: '6px 14px',
                  borderRadius: '18px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                {t('login')}
              </Link>
            </div>
          )}

          {/* Mobile toggle button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
            className="mobile-nav-toggle"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Primary Farmer Navigation Links Bar */}
      <nav style={{
        backgroundColor: 'rgba(23, 62, 29, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4px 16px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none'
        }}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '8px 14px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '800' : '500',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#1b5e20' : 'transparent',
                  borderBottom: isActive ? '3px solid #ffb300' : '3px solid transparent',
                  transition: 'background 0.2s'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
