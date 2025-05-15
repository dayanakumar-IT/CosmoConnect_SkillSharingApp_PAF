// src/pages/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaGithub, FaSatellite, FaUserAstronaut } from 'react-icons/fa';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import FormInput from '../components/FormInput';
import AuthSidebar from '../components/AuthSidebar';
import { authService } from '../api';

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      
      // Call the register API through our service
      await authService.register(data);
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        // Handle validation errors from server
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // If it's a validation error object with field names
          const firstError = Object.values(err.response.data)[0];
          setError(firstError || 'Failed to create an account');
        } else {
          // If it's a simple message
          setError(err.response.data.message || 'Failed to create an account');
        }
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const handleGithubSignIn = () => {
    window.location.href = authService.getGithubAuthUrl();
  };

  return (
    <div className="flex h-screen">
      {/* Video Side - Placed first on the left side for signup page */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthSidebar 
            title="Join the Cosmic Community" 
            description="Sign up to share your astronomical discoveries, learn from fellow enthusiasts, and explore the wonders of space together."
            isSignup={true}
        />
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center">
                <FaUserAstronaut className="text-3xl text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-nasa text-white mb-2">
              COSMO CONNECT
            </h1>
            <p className="text-lg text-yellow-400">
              Begin your journey among the stars
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6">
              <div className="flex">
                <div className="py-1">
                  <svg className="w-6 h-6 mr-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                {/* Name Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <FiUser className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                    text-white placeholder-gray-400"
                  placeholder="Full name"
                  {...register('name', { 
                    required: 'Name is required' 
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="relative">
                {/* Email Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                    text-white placeholder-gray-400"
                  placeholder="Email address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                {/* Password Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                    text-white placeholder-gray-400"
                  placeholder="Password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="relative">
                {/* Confirm Password Icon */}
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                    text-white placeholder-gray-400"
                  placeholder="Confirm password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 
                  border border-transparent text-sm font-medium rounded-lg text-white 
                  bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150 
                  disabled:opacity-50"
              >
                <span className="inline-flex items-center">
                  <FaSatellite className="h-5 w-5 mr-2 text-white" />
                  {loading ? 'Launching...' : 'Begin Your Journey'}
                </span>
              </button>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full inline-flex justify-center items-center py-3 px-4 
                  border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm 
                  font-medium text-gray-300 hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                <span>Google</span>
              </button>
              <button
                onClick={handleGithubSignIn}
                className="w-full inline-flex justify-center items-center py-3 px-4 
                  border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm 
                  font-medium text-gray-300 hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150"
              >
                <FaGithub className="w-5 h-5 mr-2 text-white" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-500 hover:text-purple-400">
                Launch back in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;