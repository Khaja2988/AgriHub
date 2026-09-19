import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getOfflineQueue, clearOfflineQueue } from './offlineStorage';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerAutoSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check of queue count
    const queue = getOfflineQueue();
    setQueueCount(queue.length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerAutoSync = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    setSyncing(true);
    try {
      for (const item of queue) {
        await axios.post(`${API_BASE}/api/sync/queue`, item);
      }
      clearOfflineQueue();
      setQueueCount(0);
    } catch (err) {
      console.warn('Sync failed:', err.message);
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && queueCount === 0) {
    return null; // Keep screen clean when connected with nothing pending
  }

  return (
    <div style={{
      backgroundColor: isOnline ? '#2e7d32' : '#d97706',
      color: '#ffffff',
      padding: '8px 16px',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{isOnline ? '🟢' : '📡'}</span>
        <span>
          {isOnline
            ? (syncing ? 'Syncing saved offline drafts...' : `Online - ${queueCount} offline item(s) pending sync`)
            : t('offlineNotice')}
        </span>
      </div>

      {isOnline && queueCount > 0 && (
        <button
          onClick={triggerAutoSync}
          disabled={syncing}
          style={{
            backgroundColor: '#ffffff',
            color: '#2e7d32',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 12px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      )}
    </div>
  );
};
