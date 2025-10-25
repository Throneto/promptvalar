import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth.service';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * 路由守卫组件
 * 保护需要登录才能访问的页面
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // 未登录，重定向到登录页面，并保存原始路径
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 已登录，显示子组件
  return <>{children}</>;
}

export default ProtectedRoute;

