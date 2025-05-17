import React, { useState, useEffect } from 'react';
import { FaRocket, FaGlobe, FaFilePdf, FaEye, FaArrowRight, FaArrowLeft, FaCheckCircle, FaStar, FaCloudUploadAlt } from 'react-icons/fa';

const steps = [
  { label: 'Title', icon: <FaStar /> },
  { label: 'Details', icon: <FaGlobe /> },
  { label: 'Upload', icon: <FaFilePdf /> },
  { label: 'Review', icon: <FaEye /> },
];

const DIFFICULTY_OPTIONS = [
  { value: '', label: 'Select Difficulty' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const defaultForm = {
  title: '',
  description: '',
  difficultyLevel: '',
  duration: 4,
  certificate: '',
  price: '',
  isPublic: true,
};

const getBackendUrl = (path) => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/api')) return API_BASE.replace(/\/api$/, '') + path;
  return API_BASE + path;
};

export default function LearningPlanForm({
  open,
  onClose,
  onSubmit,
  initialValues = {},
  loading = false,
  error = '',
  submitLabel = 'Create',
  isEditMode = false
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm({ ...defaultForm, ...initialValues });
      setFile(null);
    }
  }, [open, initialValues]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSliderChange = (e) => {
    setForm((prev) => ({ ...prev, duration: e.target.value }));
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, file);
  };

  const handleDownloadMaterial = async (url) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      alert('Failed to download file');
      return;
    }
    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  };

  // Step content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 text-gray-900 placeholder-gray-400" required />
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 placeholder-gray-400" required />
          </>
        );
      case 1:
        return (
          <>
            <label className="block font-semibold text-gray-700 mb-1">Difficulty Level</label>
            <select name="difficultyLevel" value={form.difficultyLevel} onChange={handleChange} className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-900" required>
              {DIFFICULTY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label className="block font-semibold text-gray-700 mb-1">Duration (weeks): <span className="font-bold text-purple-600">{form.duration}</span></label>
            <input type="range" name="duration" min="1" max="52" value={form.duration} onChange={handleSliderChange} className="w-full accent-purple-500 mb-4" />
            <label className="block font-semibold text-gray-700 mb-1">Certificate</label>
            <input type="text" name="certificate" value={form.certificate} onChange={handleChange} placeholder="Certificate" className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-gray-900 placeholder-gray-400" />
            <label className="block font-semibold text-gray-700 mb-1">Price ($)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 placeholder-gray-400" />
          </>
        );
      case 2:
        return (
          <>
            <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
              <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} className="accent-purple-600" />
              Public
            </label>
            <label className="block font-semibold text-gray-700 mb-1">Learning Material (PDF)</label>
            <label className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg cursor-pointer shadow hover:from-purple-600 hover:to-pink-600 transition">
              <FaCloudUploadAlt />
              <span>{file ? file.name : 'Choose PDF file'}</span>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
            {/* Show view/download button if editing and material exists and no new file selected */}
            {isEditMode && initialValues?.learningMaterials && initialValues.learningMaterials.length > 0 && !file && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => handleDownloadMaterial(getBackendUrl(initialValues.learningMaterials[0]))}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                >
                  View Material
                </button>
              </div>
            )}
          </>
        );
      case 3:
        return (
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-purple-300">
              <div className="flex items-center gap-3 mb-4">
                <FaStar className="text-yellow-400 text-2xl" />
                <h3 className="text-xl font-bold text-purple-800">{form.title || 'No Title'}</h3>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaGlobe className="text-blue-500" />
                <span className="text-gray-700 font-medium">{form.description || 'No Description'}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaRocket className="text-pink-500" />
                <span className="text-gray-700">Difficulty: <span className="font-semibold text-purple-700">{form.difficultyLevel || 'N/A'}</span></span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaArrowRight className="text-purple-500" />
                <span className="text-gray-700">Duration: <span className="font-semibold text-purple-700">{form.duration} weeks</span></span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                <span className="text-gray-700">Certificate: <span className="font-semibold text-purple-700">{form.certificate || 'None'}</span></span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaCloudUploadAlt className="text-pink-400" />
                <span className="text-gray-700">File: <span className="font-semibold text-purple-700">{file ? file.name : (isEditMode && initialValues?.learningMaterials?.[0] ? 'Already uploaded' : 'None')}</span></span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaEye className={form.isPublic ? 'text-purple-600' : 'text-gray-400'} />
                <span className="text-gray-700">{form.isPublic ? 'Public' : 'Private'}</span>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <FaFilePdf className="text-red-500" />
                <span className="text-gray-700">Price: <span className="font-semibold text-purple-700">${form.price || '0'}</span></span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-8 relative border-4 border-purple-300 sm:rounded-2xl rounded-lg max-h-[95vh] overflow-y-auto">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={onClose}><FaRocket size={24} /></button>
        {/* Cosmic Journey Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {steps.map((s, idx) => (
            <div key={s.label} className="flex-1 flex flex-col items-center relative">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-4 ${idx === step ? 'border-pink-500 bg-purple-600 text-white animate-pulse' : 'border-purple-300 bg-white text-purple-600'} z-10`}>{s.icon}</div>
              <span className={`mt-2 text-xs font-bold ${idx === step ? 'text-pink-600' : 'text-purple-400'}`}>{s.label}</span>
              {idx < steps.length - 1 && (
                <div className={`absolute top-5 left-1/2 w-full h-1 ${idx < step ? 'bg-pink-500' : 'bg-purple-200'} z-0`} style={{ right: '-50%', left: '50%' }}></div>
              )}
            </div>
          ))}
        </div>
        {/* Animated Rocket */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex-1 relative h-6">
            <div className="absolute left-0 top-0 h-6 flex items-center" style={{ left: `${(step/(steps.length-1))*100}%`, transition: 'left 0.4s cubic-bezier(.4,2,.3,1)' }}>
              <FaRocket className="text-pink-500 text-2xl animate-bounce" />
            </div>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4 font-semibold bg-red-100 rounded px-3 py-2">{error}</div>}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {renderStep()}
          <div className="flex justify-between gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
            {step > 0 && <button type="button" onClick={handleBack} className="px-5 py-2 bg-purple-200 text-purple-700 rounded-lg font-semibold hover:bg-purple-300 transition flex items-center gap-1"><FaArrowLeft /> Back</button>}
            {step < steps.length - 1 && <button type="button" onClick={handleNext} className="px-5 py-2 bg-purple-600 text-white rounded-lg font-bold shadow hover:bg-purple-700 transition flex items-center gap-1">Next <FaArrowRight /></button>}
            {step === steps.length - 1 && <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-bold shadow hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-60 flex items-center gap-1">{loading ? (isEditMode ? 'Saving...' : 'Creating...') : <>{submitLabel} <FaCheckCircle /></>}</button>}
          </div>
        </form>
      </div>
    </div>
  );
} 