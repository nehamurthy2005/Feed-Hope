import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import PrivateRoute from './components/PrivateRoute';

import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import FoodList       from './pages/FoodList';
import FoodDetail     from './pages/FoodDetail';
import PostFood       from './pages/PostFood';
import Dashboard      from './pages/Dashboard';
import Profile        from './pages/Profile';
import ImpactStats    from './pages/ImpactStats';
import AdminDashboard from './pages/AdminDashboard';

// Add Google font
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuth = ['/login','/register'].includes(location.pathname);

  return (
    <AppLayout>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/food"     element={<FoodList />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/impact"   element={<ImpactStats />} />
        <Route path="/post-food"  element={<PrivateRoute><PostFood /></PrivateRoute>} />
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin"      element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000}
          toastStyle={{ fontFamily:"'DM Sans',sans-serif", borderRadius:12 }} />
      </Router>
    </AuthProvider>
  );
}

export default App;
