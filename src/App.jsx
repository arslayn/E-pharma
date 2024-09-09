import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './screens/AdminDashboard';
import StaffDashboard from './screens/StaffDashboard';
import UserDashboard from './screens/UserDashboard';
import Signin from './screens/Signin';
import Signup from './screens/Signup';
import HomePage from './screens/HomePage';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ element, requiredRole }) => {
  const { user, role } = useAuth();

  // Check if user data is still loading
  if (user === null || role === null) {
    // You can optionally show a loading indicator or redirect to a loading page
    return <div>Loading...</div>;
  }

  // Redirect if user is not authenticated
  if (!user) {
    
    return <Navigate to="/signin" />;
  }

  // Redirect if requiredRole is specified but user doesn't have the role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/signin" />;
  }

  return element;
};


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/adminDashboard"
            element={<PrivateRoute element={<AdminDashboard />} requiredRole="admin" />}
          />
          <Route
            path="/staffDashboard"
            element={<PrivateRoute element={<StaffDashboard />} requiredRole="staff" />}
          />
          <Route
            path="/userDashboard"
            element={<PrivateRoute element={<UserDashboard />} requiredRole="user" />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
