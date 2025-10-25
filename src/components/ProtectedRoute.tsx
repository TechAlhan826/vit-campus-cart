import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSeller?: boolean;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSeller = false,
  requireAdmin = false 
}) => {
  const { isAuthenticated, isSeller, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireSeller && !isSeller) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
