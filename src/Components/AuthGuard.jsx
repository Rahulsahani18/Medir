// Components/AuthGuard.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Universal Authentication Guard Component
 * 
 * Usage:
 * - type="public": For auth pages (login/register) - redirects to home if already logged in
 * - type="private": For protected pages - redirects to login if not authenticated
 * 
 * Examples:
 * <AuthGuard type="public"><Auth /></AuthGuard>
 * <AuthGuard type="private"><UserProfile /></AuthGuard>
 */
const AuthGuard = ({ children, type = "public" }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // For public pages (login, register, etc.)
  if (type === "public") {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    // User is not authenticated, allow access to auth pages
    return children;
  }

  // For private pages (profile, booking, etc.)
  if (type === "private") {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate 
        to="/auth?mode=login" 
        state={{ from: location.pathname }} 
        replace 
      />;
    }
    // User is authenticated, allow access to protected page
    return children;
  }

  // Default: just render children (no protection)
  return children;
};

export default AuthGuard;