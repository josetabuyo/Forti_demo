import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Obras from './pages/Obras';
import ObraForm from './pages/ObraForm';
import ObraDetalle from './pages/ObraDetalle';
import AberturaForm from './pages/AberturaForm';
import type { ReactNode } from 'react';

function RequireAuth({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function TopNav() {
  const { logout } = useAuth();
  return (
    <nav className="topnav">
      <NavLink to="/obras" className="topnav-logo">
        <span className="topnav-logo-title">FORTI</span>
        <span className="topnav-logo-sub">Sistema de Obras</span>
      </NavLink>
      <div className="topnav-divider" />
      <div className="topnav-nav">
        <NavLink
          to="/obras"
          className={({ isActive }) => 'topnav-link' + (isActive ? ' active' : '')}
        >
          Obras
        </NavLink>
      </div>
      <div className="topnav-actions">
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <TopNav />
      <main className="page">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/obras" replace /> : <Login />} />
      <Route
        path="/obras"
        element={
          <RequireAuth>
            <AppLayout><Obras /></AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/obras/nueva"
        element={
          <RequireAuth>
            <AppLayout><ObraForm /></AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/obras/:id"
        element={
          <RequireAuth>
            <AppLayout><ObraDetalle /></AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/obras/:id/aberturas/nueva"
        element={
          <RequireAuth>
            <AppLayout><AberturaForm /></AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/aberturas/:id/editar"
        element={
          <RequireAuth>
            <AppLayout><AberturaForm /></AppLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/obras" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
