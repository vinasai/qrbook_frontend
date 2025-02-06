import { useAuth } from "@/components/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ 
  children,
  requiredRole
}: { 
  children: JSX.Element;
  requiredRole?: "user" | "admin";
}) => {
  const { isLoggedIn, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};