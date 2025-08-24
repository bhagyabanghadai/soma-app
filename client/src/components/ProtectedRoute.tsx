import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginRequired from '@/components/LoginRequired';

interface ProtectedRouteProps {
  children: React.ReactNode;
  feature: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, feature }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginRequired feature={feature} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;