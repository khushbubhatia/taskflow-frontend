import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/board/:id"
            element={
              <ProtectedRoute>
                <BoardView />
              </ProtectedRoute>
            }
          />
          <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
              </ProtectedRoute>
              }
              />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;