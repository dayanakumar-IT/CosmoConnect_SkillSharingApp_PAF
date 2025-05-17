import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Modal from './Modal';

const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
  return API_BASE + path;
};

const CompetitionDetails = ({ competition, isOpen, onClose }) => {
  const [slide, setSlide] = useState(0);

  if (!competition) return null;

  const downloadButton = competition.competition_instructions && (
    <button
      onClick={() =>
        window.open(
          getBackendUrl(competition.competition_instructions),
          '_blank'
        )
      }
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 mt-4 shadow-lg"
    >
      <span role="img" aria-label="rocket">🚀</span>
      Download Instructions
    </button>
  );

  const slides = [
    // Slide 1: Banner + Title + Status + Download
    <div key="banner" className="flex flex-col items-center w-full">
      {competition.competitionBanner && (
        <img
          src={getBackendUrl(competition.competitionBanner)}
          alt={competition.competitionTitle}
          className="w-full max-h-80 object-cover rounded-lg mb-4 shadow-md"
        />
      )}
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <span role="img" aria-label="trophy">🏆</span>
        {competition.competitionTitle}
      </h2>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-md ${
        competition.competitionStatus === 'ACTIVE'
          ? 'bg-green-500 text-white'
          : competition.competitionStatus === 'COMPLETED'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-500 text-white'
      }`}>
        {competition.competitionStatus}
      </span>
      {downloadButton}
    </div>,

    // Slide 2: Basic Info (single card, emojis, color highlights, no bar, inline values)
    <div key="info" className="w-full rounded-lg p-6 shadow flex flex-col items-start bg-transparent">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-blue-300 flex items-center gap-1 text-lg"><span role="img" aria-label="satellite">🛰️</span>Category:</span>
        <span className="text-white text-lg">{competition.competitionCategory}</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-purple-300 flex items-center gap-1 text-lg"><span role="img" aria-label="satellite">🛰️</span>Type:</span>
        <span className="text-white text-lg">{competition.competitionType}</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-pink-300 flex items-center gap-1 text-lg"><span role="img" aria-label="busts">👥</span>Team Size:</span>
        <span className="text-white text-lg">Maximum {competition.maxTeamSize} members</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-yellow-300 flex items-center gap-1 text-lg"><span role="img" aria-label="calendar">📅</span>Start Date:</span>
        <span className="text-white text-lg">{new Date(competition.startDate).toLocaleDateString()}</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-yellow-300 flex items-center gap-1 text-lg"><span role="img" aria-label="calendar">📅</span>Submission Deadline:</span>
        <span className="text-white text-lg">{new Date(competition.submissionDeadline).toLocaleDateString()}</span>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold text-green-300 flex items-center gap-1 text-lg"><span role="img" aria-label="timer">⏳</span>Countdown Timer:</span>
        <span className={`text-lg font-semibold ${competition.countdownTimerEnabled ? 'text-green-400' : 'text-gray-400'}`}>{competition.countdownTimerEnabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    </div>,

    // Slide 3: Description
    <div key="desc" className="w-full bg-gradient-to-br from-pink-900 to-gray-900 rounded-lg p-6 shadow flex flex-col items-start">
      <h3 className="font-semibold mb-2 flex items-center gap-2"><span role="img" aria-label="memo">📝</span>Description</h3>
      <p className="whitespace-pre-wrap text-gray-200">{competition.competitionDescription}</p>
    </div>,

    // Slide 4: Problem Statement
    <div key="problem" className="w-full bg-gradient-to-br from-yellow-900 to-gray-900 rounded-lg p-6 shadow flex flex-col items-start">
      <h3 className="font-semibold mb-2 flex items-center gap-2"><span role="img" aria-label="question">❓</span>Problem Statement</h3>
      <p className="whitespace-pre-wrap text-gray-200">{competition.problemStatement}</p>
    </div>,
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="relative max-w-2xl mx-auto bg-gray-900 rounded-lg p-8 min-h-[350px] flex flex-col items-center">
        {/* Slide content */}
        {slides[slide]}

        {/* Slide controls */}
        <div className="flex justify-between items-center w-full mt-8">
          <button
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            disabled={slide === 0}
            className={`p-2 rounded-full ${slide === 0 ? 'opacity-30' : 'hover:bg-gray-700'}`}
          >
            <FaArrowLeft size={24} />
          </button>
          <span className="text-gray-400">{slide + 1} / {slides.length}</span>
          <button
            onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
            disabled={slide === slides.length - 1}
            className={`p-2 rounded-full ${slide === slides.length - 1 ? 'opacity-30' : 'hover:bg-gray-700'}`}
          >
            <FaArrowRight size={24} />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompetitionDetails; 