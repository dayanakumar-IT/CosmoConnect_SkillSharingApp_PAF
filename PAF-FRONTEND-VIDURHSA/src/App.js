// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import NebulaBackground from './components/NebulaBackground';
import { useCursor } from './hooks/useCursor';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import CompetitionList from './components/competitions/CompetitionList';
import CompetitionForm from './components/competitions/CompetitionForm';
import CompetitionDetail from './components/competitions/CompetitionDetail';
import AdminDashboard from './components/competitions/AdminDashboard';
import CompetitionView from './components/competitions/CompetitionView';

// Dummy data for competitions
const dummyCompetitions = [
  {
    id: 1,
    competitionTitle: 'Astrophotography Challenge 2024',
    competitionCategory: 'Astrophotography',
    competitionType: 'Individual',
    maxTeamSize: 1,
    competitionDescription: 'Capture the beauty of the night sky in this exciting astrophotography competition.',
    problemStatement: 'Submit your best astrophotography shots of celestial objects.',
    startDate: '2024-03-01T00:00:00',
    submissionDeadline: '2024-04-01T23:59:59',
    competitionStatus: 'Upcoming',
    countdownTimerEnabled: true,
    competitionBanner: null,
    competitionInstructions: null
  },
  {
    id: 2,
    competitionTitle: 'Space DIY Project Competition',
    competitionCategory: 'Space DIY',
    competitionType: 'Group',
    maxTeamSize: 5,
    competitionDescription: 'Build your own space-related project and showcase your engineering skills.',
    problemStatement: 'Design and build a functional model of a space station or satellite.',
    startDate: '2024-02-15T00:00:00',
    submissionDeadline: '2024-05-15T23:59:59',
    competitionStatus: 'Ongoing',
    countdownTimerEnabled: false,
    competitionBanner: null,
    competitionInstructions: null
  }
];

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  // Allow access to admin routes without strict checking
  return children;
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

// Competition View Wrapper Component
const CompetitionViewWrapper = ({ competitions }) => {
  const { id } = useParams();
  const competition = competitions.find(c => c.id === parseInt(id));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return <CompetitionView competition={competition} isAdmin={isAdmin} />;
};

const CompetitionDetailWrapper = ({ competitions, isAdmin }) => {
  const { id } = useParams();
  const competition = competitions.find(c => c.id === parseInt(id));
  return <CompetitionDetail competition={competition} isAdmin={isAdmin} />;
};

function App() {
  useCursor();
  const [competitions, setCompetitions] = useState(dummyCompetitions);

  const handleAddCompetition = (newCompetition) => {
    setCompetitions(prev => [...prev, { ...newCompetition, id: prev.length + 1 }]);
  };

  const handleUpdateCompetition = (updatedCompetition) => {
    setCompetitions(prev => prev.map(comp => 
      comp.id === updatedCompetition.id ? updatedCompetition : comp
    ));
  };

  const handleDeleteCompetition = (id) => {
    setCompetitions(prev => prev.filter(comp => comp.id !== id));
  };

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
                <CompetitionList competitions={competitions} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/competitions/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <CompetitionDetailWrapper competitions={competitions} isAdmin={false} />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard competitions={competitions} />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/competitions" 
          element={
            <AdminRoute>
              <Layout>
                <CompetitionList competitions={competitions} isAdmin={true} />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/competitions/add" 
          element={
            <AdminRoute>
              <Layout>
                <CompetitionForm onSubmit={handleAddCompetition} />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/competitions/edit/:id" 
          element={
            <AdminRoute>
              <Layout>
                <CompetitionForm 
                  competition={competitions.find(c => c.id === parseInt(window.location.pathname.split('/').pop()))}
                  onSubmit={handleUpdateCompetition}
                />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/competitions/:id" 
          element={
            <AdminRoute>
              <Layout>
                <CompetitionDetailWrapper competitions={competitions} isAdmin={true} />
              </Layout>
            </AdminRoute>
          } 
        />
        <Route 
          path="/explore" 
          element={
            <ProtectedRoute>
              <Layout>
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