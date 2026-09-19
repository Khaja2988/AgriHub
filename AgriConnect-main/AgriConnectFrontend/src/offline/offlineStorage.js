/**
 * Offline and LocalStorage Storage Manager for AGRIHUB
 * Safeguards farmer data in low connectivity and rural conditions.
 */

const STORAGE_KEYS = {
  SELLING_DRAFT: 'agrihub_selling_draft',
  FARMER_PROFILE_DRAFT: 'agrihub_farmer_profile_draft',
  LOCAL_DIAGNOSES: 'agrihub_local_diagnoses',
  SYNC_QUEUE: 'agrihub_sync_queue'
};

export const saveSellingDraft = (draftData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELLING_DRAFT, JSON.stringify(draftData));
    return true;
  } catch (e) {
    console.error('Error saving selling draft offline:', e);
    return false;
  }
};

export const getSellingDraft = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SELLING_DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const clearSellingDraft = () => {
  localStorage.removeItem(STORAGE_KEYS.SELLING_DRAFT);
};

export const saveDiagnosisLocally = (diagnosis) => {
  try {
    const existing = getLocalDiagnoses();
    const updated = [diagnosis, ...existing].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.LOCAL_DIAGNOSES, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving diagnosis locally:', e);
  }
};

export const getLocalDiagnoses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_DIAGNOSES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const queueOfflineAction = (actionType, payload) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push({ id: Date.now(), actionType, payload, timestamp: new Date() });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    return true;
  } catch (e) {
    return false;
  }
};

export const getOfflineQueue = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearOfflineQueue = () => {
  localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
};
