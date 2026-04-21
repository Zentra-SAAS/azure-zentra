import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { azureAuth } from '../lib/api';
import { ShoppingCart, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, login, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'join'>('login');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    orgCode: '',
    passkey: '',
    userCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    orgCode: '',
    passkey: '',
    userCode: ''
  });

  useEffect(() => {
    if (searchParams.get('mode') === 'join') {
      setMode('join');
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
      orgCode: '',
      passkey: '',
      userCode: ''
    };

    // Common validations
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // Join mode validations
    if (mode === 'join') {
      if (!formData.orgCode) errors.orgCode = 'Organization Code is required';
      if (!formData.passkey) errors.passkey = 'Passkey is required';
      if (!formData.userCode) errors.userCode = 'User Code is required';
    }

    setFieldErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleJoin = async () => {
    try {
      const { data, error } = await azureAuth.joinOrganization(
        formData.orgCode,
        formData.passkey,
        formData.userCode,
        formData.email,
        formData.password
      );
      if (error || !data) throw new Error(error || 'Failed to join organization');
      // login context is refreshed via useEffect watching localStorage
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to join organization';
      throw new Error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'join') {
        await handleJoin();
      } else {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Zentra
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join Your Team'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login'
              ? 'Sign in to access your dashboard'
              : 'Enter your organization credentials to get started'}
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            Owner Login
          </button>
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'join'
              ? 'bg-violet-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            Join Organization
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* General Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                    {mode === 'login' ? 'Login Failed' : 'Join Failed'}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Join Mode Fields */}
            {mode === 'join' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="orgCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Org Code
                    </label>
                    <input
                      id="orgCode"
                      name="orgCode"
                      type="text"
                      required={mode === 'join'}
                      value={formData.orgCode}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 ${fieldErrors.orgCode ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      placeholder="ORG-..."
                    />
                    {fieldErrors.orgCode && <p className="mt-1 text-xs text-red-600">{fieldErrors.orgCode}</p>}
                  </div>
                  <div>
                    <label htmlFor="passkey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Passkey
                    </label>
                    <input
                      id="passkey"
                      name="passkey"
                      type="text" // Passkey is text visible or password? User request said "organization passkey", usually text? Let's assume text for easier entry or password type? "Passkey" usually implies secret. Let's make it password type but toggleable? Or just text if it's short. Let's use text for now to avoid confusion, or password-like. Let's stick to text as Org Code is text.
                      required={mode === 'join'}
                      value={formData.passkey}
                      onChange={handleInputChange}
                      className={`appearance-none block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 ${fieldErrors.passkey ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                        }`}
                      placeholder="Secret Key"
                    />
                    {fieldErrors.passkey && <p className="mt-1 text-xs text-red-600">{fieldErrors.passkey}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="userCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    User Code
                  </label>
                  <input
                    id="userCode"
                    name="userCode"
                    type="text"
                    required={mode === 'join'}
                    value={formData.userCode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className={`appearance-none block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 ${fieldErrors.userCode ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    placeholder="6-digit code provided by your manager"
                  />
                  {fieldErrors.userCode && <p className="mt-1 text-xs text-red-600">{fieldErrors.userCode}</p>}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500">
                      Create your login
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${fieldErrors.email
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="Enter your email address"
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'join' ? 'Create Password' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'join' ? 'new-password' : 'current-password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${fieldErrors.password
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                    }`}
                  placeholder={mode === 'join' ? 'Create a strong password' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{mode === 'join' ? 'Joining...' : 'Signing in...'}</span>
                  </div>
                ) : (
                  mode === 'join' ? 'Join Organization' : 'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            {mode === 'login' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Only organization owners can access this dashboard
              </p>
            )}
            {mode === 'join' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Contact your manager if you don't have these details
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;