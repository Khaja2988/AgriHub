import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sellingApi } from '../services/api';

export const SellingRequests = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await sellingApi.getSellingRequests();
      if (res.data?.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load selling requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return { bg: '#e8f5e9', color: '#2e7d32', label: 'Accepted by Buyer' };
      case 'IN_PROGRESS':
        return { bg: '#e1f5fe', color: '#0288d1', label: 'Transport Dispatched' };
      case 'COMPLETED':
        return { bg: '#ede7f6', color: '#512da8', label: 'Completed & Paid' };
      default:
        return { bg: '#fff3e0', color: '#e65100', label: 'Pending Verification' };
    }
  };

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '24px 16px', minHeight: '80vh' }}>
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        color: '#ffffff'
      }}>
        <div>
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
            📋 TRACKING DASHBOARD
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            📋 {t('myRequests')}
          </h1>
          <p style={{ color: '#d1fae5', margin: 0, fontSize: '0.94rem', fontWeight: '500' }}>
            Track the live status of your direct crop selling dispatches.
          </p>
        </div>

        <button
          onClick={() => navigate('/sell')}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#0f2913',
            border: 'none',
            borderRadius: '20px',
            padding: '11px 22px',
            fontWeight: '800',
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}
        >
          <span>➕</span> New Selling Request
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading selling requests...</div>
      ) : requests.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px 20px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌾</div>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>No Selling Requests Yet</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
            Calculate net value and submit your first harvest selling request with our Decision Engine.
          </p>
          <button
            onClick={() => navigate('/sell')}
            style={{
              backgroundColor: '#2e7d32',
              color: '#ffffff',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 28px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Start Selling Wizard
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map(req => {
            const statusInfo = getStatusBadge(req.status);
            return (
              <div
                key={req._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1b5e20' }}>
                      {req.crop} ({req.quantity} kg)
                    </span>
                    <span style={{
                      backgroundColor: statusInfo.bg,
                      color: statusInfo.color,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '800'
                    }}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '6px' }}>
                    Recipient: <strong>{req.buyerName || req.fpoName || 'Sri Krishna Agro Traders'}</strong>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '8px' }}>
                    🚚 Logistics: {req.logisticsName || 'Kisan Rural Logistics'} | ❄️ Storage: {req.storageName || 'Cold Chain'}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                    Harvest Date: {req.harvestDate} | Pickup: {req.pickupLocation}
                  </div>
                </div>

                {/* Net Earnings Highlight */}
                <div style={{ textAlign: 'right', minWidth: '160px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#777' }}>Estimated Net Take-Home:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#2e7d32', marginBottom: '6px' }}>
                    ₹{req.estimatedNetValue?.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#999' }}>
                    Gross: ₹{req.estimatedGrossValue?.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
