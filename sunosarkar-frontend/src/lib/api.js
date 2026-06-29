import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/user/register', data);
export const registerOfficer = (data) => api.post('/auth/officer/register', data);
export const verifyEmail = (data) => api.post('/auth/verify-email', data);
export const resendOtp = (email) => api.post(`/auth/resend-otp?email=${email}`);
export const loginUser = (data) => api.post('/auth/user-login', data);
export const loginOfficer = (data) => api.post('/auth/officer-login', data);

// ─── Complaints ──────────────────────────────────────────────────────────────
export const fileComplaint = (formData) =>
  api.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyComplaints = () => api.get('/complaints/my');
export const getPublicComplaints = (city, page = 0, size = 10) =>
  api.get(`/complaints/public?city=${city}&page=${page}&size=${size}`);
export const getAreaComplaints = (ucCode, page = 0, size = 10) =>
  api.get(`/complaints/area?ucCode=${ucCode}&page=${page}&size=${size}`);
export const getAllComplaints = (page = 0, size = 10) =>
  api.get(`/complaints/all?page=${page}&size=${size}`);
export const updateComplaintStatus = (id, newStatus, note) =>
  api.post(`/complaints/${id}/status?newStatus=${newStatus}${note ? `&note=${encodeURIComponent(note)}` : ''}`);
export const confirmResolved = (id) => api.post(`/complaints/${id}/confirm`);
export const upvoteComplaint = (id) => api.post(`/complaints/${id}/upVote`);

// ─── Officer ─────────────────────────────────────────────────────────────────
export const getOfficerDashboard = () => api.get('/officer/dashboard');
export const getOfficerPending = () => api.get('/officer/pending');
export const getLeaderboard = () => api.get('/officer/leaderboard');

// ─── Stats ───────────────────────────────────────────────────────────────────
export const getCityStats = (city) => api.get(`/stats/city/${city}`);
export const getCategoryBreakdown = (city) => api.get(`/stats/categories/${city}`);
export const getStatusBreakdown = (city) => api.get(`/stats/status/${city}`);

// ─── Emergency ───────────────────────────────────────────────────────────────
export const getEmergencyContacts = (city) => api.get(`/emergency/${city}`);

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminGetUsers = () => api.get('/admin/users');
export const adminGetOfficers = () => api.get('/admin/officers');
export const adminGetPendingOfficers = () => api.get('/admin/officers/pending');
export const adminVerifyOfficer = (id) => api.put(`/admin/officers/${id}/verify`);
export const adminDeactivateUser = (id) => api.put(`/admin/users/${id}/deactivate`);
export const adminGetStats = () => api.get('/admin/stats');

export default api;
