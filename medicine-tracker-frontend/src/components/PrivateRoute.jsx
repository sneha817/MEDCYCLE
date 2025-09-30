import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ role }) => {
  const { userInfo, adminInfo } = useSelector((state) => state.auth);

  if (role === 'user') return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
  if (role === 'admin') return adminInfo ? <Outlet /> : <Navigate to="/admin/login" replace />;
  return <Navigate to="/" replace />;
};

export default PrivateRoute;