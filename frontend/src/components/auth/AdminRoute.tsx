import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../services/auth.service';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * 管理员路由保护组件
 * 只允许管理员访问
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const isAuth = isAuthenticated();
  const isAdminUser = isAdmin();

  // 未登录，重定向到登录页
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 已登录但不是管理员，重定向到首页
  if (!isAdminUser) {
    return <Navigate to="/" replace />;
  }

  // 是管理员，允许访问
  return <>{children}</>;
}

