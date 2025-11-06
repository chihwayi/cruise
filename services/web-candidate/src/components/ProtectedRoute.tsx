import { Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Check for token in URL first (in case redirected from public portal)
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('candidate_token', tokenFromUrl);
      localStorage.setItem('token', tokenFromUrl);
      // Remove token from URL
      searchParams.delete('token');
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsChecking(false);
  }, [searchParams]);
  
  const token = localStorage.getItem('candidate_token') || localStorage.getItem('token');
  
  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

