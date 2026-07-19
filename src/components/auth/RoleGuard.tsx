import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { sessionService } from '../../auth/session';
import type { Role } from '../../auth/demoUsers';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: Role;
}

const RoleGuard = ({ children, allowedRole }: RoleGuardProps) => {
  const location = useLocation();
  const user = sessionService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== allowedRole) {
    // If logged in but wrong role, redirect to their proper dashboard
    const redirectPath = user.role === 'institution' ? '/institution/dashboard' : '/producer/home';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleGuard;
