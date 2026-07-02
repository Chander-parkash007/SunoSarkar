import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { isLoggedIn, getRole } from './lib/auth';
import { useApp } from './context/AppContext';
import LangModal from './components/ui/LangModal';
import ErrorBoundary from './components/ui/ErrorBoundary';
import CityStatsPage from './pages/public/CityStatsPage';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OfficerRegisterPage from './pages/auth/OfficerRegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import MyComplaintsPage from './pages/citizen/MyComplaintsPage';
import NewComplaintPage from './pages/citizen/NewComplaintPage';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaintsPage from './pages/officer/OfficerComplaintsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOfficersPage from './pages/admin/AdminOfficersPage';
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage';
import PublicFeedPage from './pages/public/PublicFeedPage';
import LeaderboardPage from './pages/public/LeaderboardPage';
import EmergencyPage from './pages/public/EmergencyPage';
import MapPage from './pages/public/MapPage';

function RequireAuth({ children, role }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (role && getRole() !== role) return <Navigate to="/" replace />;
  return children;
}

function RequireAnyRole({ children, roles }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(getRole())) return <Navigate to="/" replace />;
  return children;
}

function GuestOnly({ children }) {
  if (isLoggedIn()) {
    const role = getRole();
    if (role === 'CITIZEN') return <Navigate to="/dashboard/citizen" replace />;
    if (role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/dashboard/officer" replace />;
  }
  return children;
}

const OFFICER_ROLES = ['UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN'];

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
      <div>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🔍</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--txt)' }}>404</h1>
        <p style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--txt-2)' }}>This page doesn't exist.</p>
        <a href="/" className="btn btn-primary">← Go Home</a>
      </div>
    </div>
  );
}

export default function App() {
  const { theme } = useApp();

  return (
    <BrowserRouter>
      {/* Language selection modal — shown on first visit */}
      <LangModal />

      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? 'rgba(15,23,42,0.97)' : 'rgba(255,255,255,0.97)',
            border: `1px solid ${theme === 'dark' ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.3)'}`,
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            borderRadius: '14px',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
          duration: 3500,
        }}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/complaints/public" element={<PublicFeedPage />} />
        <Route path="/stats" element={<CityStatsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />

        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/register/officer" element={<GuestOnly><OfficerRegisterPage /></GuestOnly>} />
        <Route path="/verify" element={<VerifyEmailPage />} />

        <Route path="/dashboard/citizen" element={<RequireAuth role="CITIZEN"><CitizenDashboard /></RequireAuth>} />
        <Route path="/dashboard/citizen/complaints" element={<RequireAuth role="CITIZEN"><MyComplaintsPage /></RequireAuth>} />
        <Route path="/dashboard/citizen/new" element={<RequireAuth role="CITIZEN"><NewComplaintPage /></RequireAuth>} />

        <Route path="/dashboard/officer" element={<RequireAnyRole roles={OFFICER_ROLES}><OfficerDashboard /></RequireAnyRole>} />
        <Route path="/dashboard/officer/complaints" element={<RequireAnyRole roles={OFFICER_ROLES}><OfficerComplaintsPage /></RequireAnyRole>} />

        <Route path="/dashboard/admin" element={<RequireAuth role="ADMIN"><AdminDashboard /></RequireAuth>} />
        <Route path="/dashboard/admin/users" element={<RequireAuth role="ADMIN"><AdminUsersPage /></RequireAuth>} />
        <Route path="/dashboard/admin/officers" element={<RequireAuth role="ADMIN"><AdminOfficersPage /></RequireAuth>} />
        <Route path="/dashboard/admin/complaints" element={<RequireAuth role="ADMIN"><AdminComplaintsPage /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
