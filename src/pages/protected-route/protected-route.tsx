import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { userState } from '../../services/userReducer';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

// TODO: check for user authentication
export const ProtectedRoute = ({ onlyUnAuth }: TProtectedRouteProps) => {
  const user = useSelector(userState).user;
  const location = useLocation();

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/profile' />;
  }

  return <Outlet />;
};
