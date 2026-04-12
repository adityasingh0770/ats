import api from './apiClient';
import { useAuthStore } from '../store/authStore';

const GUEST_STORAGE_KEY = 'mathmentor-guest-key';

export function getOrCreateGuestDeviceKey() {
  try {
    let k = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!k) {
      k =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `g_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(GUEST_STORAGE_KEY, k);
    }
    return k;
  } catch {
    return `anon_${Date.now()}`;
  }
}

/** Obtain JWT without login (stable learner per browser via guest_key). */
export async function ensureGuestSession() {
  if (useAuthStore.getState().token) return;
  const guest_key = getOrCreateGuestDeviceKey();
  const { data } = await api.post('/auth/guest', { guest_key });
  if (useAuthStore.getState().token) return;
  useAuthStore.getState().setAuth(data.token, data.user);
}
