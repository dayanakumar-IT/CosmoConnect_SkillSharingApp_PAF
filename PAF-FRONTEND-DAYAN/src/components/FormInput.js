// src/components/FormInput.js
import React from 'react';

const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  ...rest
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-star-white font-medium mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`
            w-full px-4 py-3 bg-space-navy border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-space-purple transition-all
            text-star-white placeholder-gray-500
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600'}
          `}
          placeholder={placeholder}
          {...register}
          {...rest}
        />
        {error && (
          <div className="absolute right-0 top-0 pr-3 flex items-center h-full pointer-events-none">
            <svg 
              className="h-5 w-5 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;