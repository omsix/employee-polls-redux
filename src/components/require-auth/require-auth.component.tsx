import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../utils/login/authedUser';
import { resetRemainingTime } from '../../utils/login/remainingSessionTime';

interface RequireAuthProps {
  children: ReactNode;
}

/**
 * Protected route wrapper component.
 * Redirects to /login if user is not authenticated.
 * Detects fresh page loads (address bar navigation) and forces logout.
 * Programmatic navigation from within the app is preserved.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const authedUser = useAppSelector((state) => state.authedUser.name);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [shouldForceLogout, setShouldForceLogout] = useState(false);

  useEffect(() => {
    // Check if this is a fresh page load (address bar navigation or refresh)
    const isActiveSPASession = sessionStorage.getItem('spa_navigation_active');
    if ((!isActiveSPASession || isActiveSPASession === "false") && authedUser) {
      // Fresh page load detected with existing auth - force logout
      dispatch(logout());
      dispatch(resetRemainingTime());
      localStorage.clear();
      setShouldForceLogout(true);
    }

  }, [authedUser, dispatch]);

  // Force logout redirect takes precedence
  if (shouldForceLogout) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  // Regular auth check
  if (!authedUser) {
    return <Navigate to="/login" replace state={{ path: location.pathname }} />;
  }

  return <>{children}</>;
};
