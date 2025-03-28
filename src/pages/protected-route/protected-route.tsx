import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userState } from '../../services/userReducer';

// TODO: check for user authentication
export const ProtectedRoute = () => {
  const user = useSelector(userState).user;
  const location = useLocation();

  if (!user) {
    return <Navigate to='/login' />;
  }

  return <Outlet />;
};
