// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import NebulaBackground from './components/NebulaBackground';
import { useCursor } from './hooks/useCursor';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import Explore from './pages/Explore';
import CompetitionList from './components/CompetitionList';
import CompetitionForm from './components/CompetitionForm';
import { AuthProvider } from './contexts/AuthContext';
import LearningPlanPage from './components/LearningPlan/LearningPlanPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationBell from './components/NotificationBell';

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

const theme = createTheme();

function App() {
  useCursor();
  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/login" element={
                  <>
                    <NebulaBackground />
                    <StarField />
                    <Login />
                  </>
                } />
                <Route path="/signup" element={
                  <>
                    <NebulaBackground />
                    <StarField />
                    <Signup />
                  </>
                } />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NebulaBackground />
                        <StarField />
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
                        <NebulaBackground />
                        <StarField />
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
                        <LearningPlanPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/competitions" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CompetitionList />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/competitions/create" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CompetitionForm />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/competitions/edit/:id" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CompetitionForm />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/competitions/:id" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CompetitionList />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/explore" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NebulaBackground />
                        <StarField />
                        <Explore />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NebulaBackground />
                        <StarField />
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/learn" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <LearningPlanPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}

export default App;