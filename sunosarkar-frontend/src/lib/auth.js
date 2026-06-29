// Auth helpers

export const saveAuth = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.role);
  localStorage.setItem('email', data.email);
  localStorage.setItem('fullName', data.fullName);
  if (data.ucCode) localStorage.setItem('ucCode', data.ucCode);
  if (data.city) localStorage.setItem('city', data.city);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('fullName');
  localStorage.removeItem('ucCode');
  localStorage.removeItem('city');
};

export const getToken = () => localStorage.getItem('token');
export const getRole = () => localStorage.getItem('role');
export const getEmail = () => localStorage.getItem('email');
export const getFullName = () => localStorage.getItem('fullName');

export const isLoggedIn = () => !!localStorage.getItem('token');

export const isCitizen = () => getRole() === 'CITIZEN';
export const isOfficer = () => ['UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR'].includes(getRole());
export const isAdmin = () => getRole() === 'ADMIN';

export const CATEGORY_LABELS = {
  ROAD: '🛣️ Road',
  WATER: '💧 Water',
  ELECTRICITY: '⚡ Electricity',
  SANITATION: '🚽 Sanitation',
  GARBAGE: '🗑️ Garbage',
  SEWAGE: '🚧 Sewage',
  STREE_LIGHT: '💡 Street Light',
  PARK: '🌳 Park',
  OTHER: '📋 Other',
};

export const CATEGORY_ICONS = {
  ROAD: '🛣️',
  WATER: '💧',
  ELECTRICITY: '⚡',
  SANITATION: '🚽',
  GARBAGE: '🗑️',
  SEWAGE: '🚧',
  STREE_LIGHT: '💡',
  PARK: '🌳',
  OTHER: '📋',
};

export const CATEGORY_COLORS = {
  ROAD: '#f59e0b',
  WATER: '#3b82f6',
  ELECTRICITY: '#eab308',
  SANITATION: '#8b5cf6',
  GARBAGE: '#6b7280',
  SEWAGE: '#78716c',
  STREE_LIGHT: '#fbbf24',
  PARK: '#22c55e',
  OTHER: '#94a3b8',
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};

export const PRIORITY_LABELS = {
  NORMAL: 'Normal',
  URGENT: 'Urgent',
  EMERGENCY: 'Emergency',
};

export const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Sargodha', 'Bahawalpur', 'Abbottabad', 'Sukkur',
];

export const ROLE_LABELS = {
  CITIZEN: 'Citizen',
  UC_CHAIRMAN: 'UC Chairman',
  TOWN_OFFICER: 'Town Officer',
  MUNICIPAL_WORKER: 'Municipal Worker',
  AC: 'Assistant Commissioner',
  DC: 'Deputy Commissioner',
  MAYOR: 'Mayor',
  MINISTER: 'Minister',
  ADMIN: 'Administrator',
};
