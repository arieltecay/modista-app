import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ProtectedRouteProps } from './types';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, validar contra el rol del usuario
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Renderiza children si se usa como wrapper, o Outlet si se usa como Layout de rutas anidadas
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
