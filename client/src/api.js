const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const api = {
  async login(email, password) {
    const r = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },
  async signup(payload) {
    const r = await fetch(`${API_BASE}/auth/signup`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },
  async changePassword(currentPassword, newPassword) {
    const r = await fetch(`${API_BASE}/auth/change-password`, { method: 'POST', headers: headers(), body: JSON.stringify({ currentPassword, newPassword }) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  async adminStats() {
    const r = await fetch(`${API_BASE}/ratings/admin/stats`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  // Admin users
  async adminListUsers({ search = '', role = '', sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 }) {
    const params = new URLSearchParams({ search, sortBy, sortDir, page, pageSize });
    if (role) params.set('role', role);
    const r = await fetch(`${API_BASE}/users?${params}`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },
  async adminCreateUser(payload) {
    const r = await fetch(`${API_BASE}/users`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },
  async adminGetUser(id) {
    const r = await fetch(`${API_BASE}/users/${id}`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  // Admin stores
  async adminListStores({ search = '', sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 }) {
    const params = new URLSearchParams({ search, sortBy, sortDir, page, pageSize });
    const r = await fetch(`${API_BASE}/stores/admin/list?${params}`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },
  async adminCreateStore(payload) {
    const r = await fetch(`${API_BASE}/stores`, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  // Stores (common)
  async listStores({ search = '', sortBy = 'name', sortDir = 'ASC', page = 1, pageSize = 20 }) {
    const params = new URLSearchParams({ search, sortBy, sortDir, page, pageSize });
    const r = await fetch(`${API_BASE}/stores?${params}`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  // Ratings
  async rateStore(storeId, value) {
    const r = await fetch(`${API_BASE}/ratings`, { method: 'POST', headers: headers(), body: JSON.stringify({ storeId, value }) });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  },

  // Owner
  async ownerDashboard() {
    const r = await fetch(`${API_BASE}/stores/owner/mine`, { headers: headers() });
    if (!r.ok) throw new Error((await r.json()).message);
    return r.json();
  }
};
