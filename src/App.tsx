import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './features/auth/ProtectedRoute';
import DashboardPage from './features/dashboard/DashboardPage';
import NotFoundPage from './features/NotFoundPage';

import WantedPage from './features/wanted/WantedPage';
import WantedDetailPage from './features/wanted/WantedDetailPage';
import NewsPage from './features/news/NewsPage';
import SagasPage from './features/sagas/SagasPage';
import SagaStoryPage from './features/sagas/SagaStoryPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wanted"
            element={
              <ProtectedRoute>
                <WantedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wanted/:id"
            element={
              <ProtectedRoute>
                <WantedDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <NewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sagas"
            element={
              <ProtectedRoute>
                <SagasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sagas/:id"
            element={
              <ProtectedRoute>
                <SagaStoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

