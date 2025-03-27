import { Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

// TODO: check for user authentication
export const ProtectedRoute = () => {
  return <Outlet />;
};
