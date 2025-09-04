
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Spinner from './components/ui/Spinner';

// Lazy load page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./components/ui/NotFoundPage'));

// A component to protect routes that require authentication
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Spinner /></div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// A component to handle routes for unauthenticated users
const UnauthenticatedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Spinner /></div>;
  }
  
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/login" element={<UnauthenticatedRoute />}>
        <Route index element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center"><Spinner /></div>}>
          <AppRoutes />
        </Suspense>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
