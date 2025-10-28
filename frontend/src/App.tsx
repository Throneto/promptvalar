import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
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
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 公开路由 */}
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
          
          {/* 受保护的路由 - 需要登录 */}
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
          
          {/* 管理员路由 - 需要管理员权限 */}
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

