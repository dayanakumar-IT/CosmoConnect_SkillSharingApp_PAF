// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaGoogle, FaFacebook, FaRocket, FaUserAstronaut } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';
import AuthSidebar from '../components/AuthSidebar';
import { authService } from '../api';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Check for error in location state (from OAuth redirect)
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
    }
  }, [location]);

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      
      await authService.login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to log in. Please check your credentials.');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = authService.getGoogleAuthUrl();
  };

  const handleFacebookSignIn = () => {
    window.location.href = authService.getFacebookAuthUrl();
  };

  return (
    <div className="flex h-screen">
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
              Sign in to explore the universe
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

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                {/* Email Icon - Explicitly positioned and made visible */}
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
                {/* Password Icon - Explicitly positioned and made visible */}
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
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-purple-500 hover:text-purple-400">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              {/* Fixed Button with proper icon spacing */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-3 px-4 
                    border border-transparent text-sm font-medium rounded-lg text-white 
                    bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 
                    focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 
                    hover:scale-105 hover:shadow-glow disabled:opacity-50"
                >
                <span className="inline-flex items-center">
                    <FaRocket className="h-5 w-5 mr-2 text-white animate-float" />
                    {loading ? 'Launching...' : 'Launch into Space'}
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
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-3 px-4 
                  border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm 
                  font-medium text-gray-300 hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150
                  disabled:opacity-50"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
                <span>Google</span>
              </button>
              <button
                onClick={handleFacebookSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-3 px-4 
                  border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-sm 
                  font-medium text-gray-300 hover:bg-gray-700 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-150
                  disabled:opacity-50"
              >
                <FaFacebook className="w-5 h-5 mr-2 text-blue-500" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-medium text-purple-500 hover:text-purple-400">
                Join the mission
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Video Side */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthSidebar 
          title="Explore the Cosmos" 
          description="Join our community of space enthusiasts and share your astronomical knowledge and experiences."
          isSignup={false}
        />
      </div>
    </div>
  );
};

export default Login;