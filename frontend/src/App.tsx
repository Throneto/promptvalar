import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import Loading from './components/common/Loading';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PromptStudioPage from './pages/PromptStudioPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import PromptDetailPage from './pages/PromptDetailPage';
import DashboardPage from './pages/DashboardPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import MyPromptsPage from './pages/MyPromptsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import SubscriptionManagementPage from './pages/SubscriptionManagementPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPromptsPage from './pages/AdminPromptsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import AboutPage from './pages/AboutPage';
import DocsPage from './pages/DocsPage';
import GuidesPage from './pages/GuidesPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟应用初始化
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5秒后隐藏加载页面

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading fullScreen size="large" text="Loading application..." />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<PromptLibraryPage />} />
          <Route path="/library/:id" element={<PromptDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          
          {/* Protected routes - login required */}
          <Route 
            path="/studio" 
            element={
              <ProtectedRoute>
                <PromptStudioPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/prompts" 
            element={
              <ProtectedRoute>
                <MyPromptsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/favorites" 
            element={
              <ProtectedRoute>
                <MyFavoritesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/subscription" 
            element={
              <ProtectedRoute>
                <SubscriptionManagementPage />
              </ProtectedRoute>
            } 
          /> 
          
          {/* Admin routes - admin permission required */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/prompts" 
            element={
              <AdminRoute>
                <AdminPromptsPage />
              </AdminRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

