import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Protected route wrapper component.
 * Redirects to /login if user is not authenticated.
 * Preserves the attempted path for redirect after login.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const authedUser = useAppSelector((state) => state.authedUser.name);
  const location = useLocation();

  if (!authedUser) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};
