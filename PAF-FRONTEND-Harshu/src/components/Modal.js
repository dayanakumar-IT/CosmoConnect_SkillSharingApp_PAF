import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-space-navy rounded-lg shadow-lg p-6 relative min-w-[350px] max-w-lg w-full">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-space-purple text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 