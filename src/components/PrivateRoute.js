import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, roles = [] }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (roles.length && !roles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
