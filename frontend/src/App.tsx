import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PromptStudioPage from './pages/PromptStudioPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import PromptDetailPage from './pages/PromptDetailPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<PromptStudioPage />} />
          <Route path="/library" element={<PromptLibraryPage />} />
          <Route path="/library/:id" element={<PromptDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

