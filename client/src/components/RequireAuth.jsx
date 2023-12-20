import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { auth } = useAuth();
  return allowedRoles?.includes(auth?.user?.role) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth" state={{ from: location }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RequireAuth;
