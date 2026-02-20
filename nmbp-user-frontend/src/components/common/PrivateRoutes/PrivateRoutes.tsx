import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import type { PrivateRoutesProps } from "./PrivateRoutesProps";

const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <div>
      {isAuthenticated ? (
        element
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      )}
    </div>
  );
};

export default PrivateRoutes;
