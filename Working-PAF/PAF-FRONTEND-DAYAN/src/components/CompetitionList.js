import React, { useState, useEffect } from 'react';
import { competitionApi } from '../api/competitionApi';
import { useAuth } from '../contexts/AuthContext';
import { FaTrophy, FaCalendarAlt, FaUsers, FaFileAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import CompetitionDetails from './CompetitionDetails';

const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
  return API_BASE + path;
};

const CompetitionList = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.email === 'admin@gmail.com';

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await competitionApi.getAll();
      setCompetitions(response.data);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Failed to fetch competitions. Please try again later.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (competition) => {
    setCompetitionToDelete(competition);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await competitionApi.delete(competitionToDelete._id);
      setCompetitions(competitions.filter(c => c._id !== competitionToDelete._id));
      setDeleteModalOpen(false);
      setCompetitionToDelete(null);
    } catch (err) {
      console.error('Error deleting competition:', err);
      setError('Failed to delete competition. Please try again.');
    }
  };

  const handleViewDetails = (competition) => {
    setSelectedCompetition(competition);
    setDetailsModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/competitions/create')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <FaTrophy className="text-lg" />
            Create Competition
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div
            key={competition._id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            {competition.competitionBanner && (
              <div className="h-48 overflow-hidden">
                <img
                  src={getBackendUrl(competition.competitionBanner)}
                  alt={competition.competitionTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">
                {competition.competitionTitle}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-2">
                {competition.competitionDescription}
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Start: {formatDate(competition.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>Deadline: {formatDate(competition.submissionDeadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>Max Team Size: {competition.maxTeamSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFileAlt />
                  <span>Category: {competition.competitionCategory}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  competition.competitionStatus === 'ACTIVE'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {competition.competitionStatus}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleViewDetails(competition)}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  >
                    View Details →
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/competitions/edit/${competition._id}`)}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(competition)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCompetitionToDelete(null);
        }}
        title="Delete Competition"
      >
        <div className="p-6 flex flex-col items-center">
          <span role="img" aria-label="comet" className="text-4xl mb-2">☄️</span>
          <p className="text-gray-300 mb-4 text-center">
            Are you sure you want to delete the competition "{competitionToDelete?.competitionTitle}"?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4 w-full">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setCompetitionToDelete(null);
              }}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      </Modal>

      <CompetitionDetails
        competition={selectedCompetition}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedCompetition(null);
        }}
      />
    </div>
  );
};

export default CompetitionList; 