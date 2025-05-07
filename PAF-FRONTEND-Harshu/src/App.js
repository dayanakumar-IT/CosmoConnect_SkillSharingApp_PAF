// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import NebulaBackground from './components/NebulaBackground';
import { useCursor } from './hooks/useCursor';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

// Layout Component with Navbar
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  useCursor();
  return (
    <Router>
      <NebulaBackground />
      <StarField />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/learning" 
          element={
            <ProtectedRoute>
              <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-3xl font-orbitron text-white mb-8">Learning Plans</h1>
                  {/* Learning Plans content will go here */}
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/competitions" 
          element={
            <ProtectedRoute>
              <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-3xl font-orbitron text-white mb-8">Space Competitions</h1>
                  {/* Competitions content will go here */}
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-3xl font-orbitron text-white mb-8">Explore Universe</h1>
                  {/* Explore content will go here */}
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;