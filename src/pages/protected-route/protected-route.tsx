import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

// TODO: check for user authentication
export const ProtectedRoute = () => {
  const user = null;
  const location = useLocation();

  if (!user) {
    return <Navigate replace to='\login' state={{ from: location }} />;
  }

  if (user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
