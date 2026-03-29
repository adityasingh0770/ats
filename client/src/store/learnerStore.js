import { create } from 'zustand';

export const useLearnerStore = create((set) => ({
  dashboard: null,
  loading: false,
  error: null,
  setDashboard: (data) => set({ dashboard: data, loading: false, error: null }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e, loading: false }),
  clearDashboard: () => set({ dashboard: null }),
}));
