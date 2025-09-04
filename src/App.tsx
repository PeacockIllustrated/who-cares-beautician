
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Spinner from './components/ui/Spinner';

// Lazy load routes
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const ClientPortal = lazy(() => import('./features/portal/ClientPortal'));
const AdminPortal = lazy(() => import('./features/admin/AdminPortal'));
const NotFoundPage = lazy(() => import('./components/ui/NotFoundPage'));

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

const AppRoutes: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="w-screen h-screen flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
      
      <Route 
        path="/admin/*" 
        element={user && isAdmin ? <AdminPortal /> : <Navigate to="/" />} 
      />
      
      <Route 
        path="/*" 
        element={user ? (isAdmin ? <Navigate to="/admin" /> : <ClientPortal />) : <Navigate to="/login" />} 
      />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
