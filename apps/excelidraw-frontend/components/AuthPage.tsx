// "use client";

// export function AuthPage({isSignin}: {
//     isSignin: boolean
// }) {
//     return <div className="w-screen h-screen flex justify-center items-center">
//         <div className="p-6 m-2 bg-white rounded">
//             <div className="p-2">
//                 <input type="text" placeholder="Email"></input>
//             </div>
//             <div className="p-2">
//                 <input type="password" placeholder="Password"></input>
                
//             </div>

//             <div className="pt-2">
//                 <button className="bg-red-200 rounded p-2" onClick={() => {

//                 }}>{isSignin ? "Sign in" : "Sign up"}</button>
//             </div>
//         </div>
//     </div>

// }









// components/AuthPage.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthPageProps {
  isSignin: boolean;
}

export function AuthPage({ isSignin }: AuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = isSignin 
        ? `${API_BASE_URL}/api/auth/signin` 
        : `${API_BASE_URL}/api/auth/signup`;
      
      const body = isSignin 
        ? { username, password } 
        : { username, password, name };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           
        },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Redirect to canvas page on successful auth
        router.push('/canvas');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side validation
  const validateForm = () => {
    if (username.length < 3 || username.length > 20) {
      return 'Username must be between 3 and 20 characters';
    }
    if (!isSignin && name.length === 0) {
      return 'Name is required';
    }
    if (password.length === 0) {
      return 'Password is required';
    }
    return null;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignin ? 'Welcome Back' : 'Join Excelidraw'}
            </h1>
            <p className="text-gray-600">
              {isSignin 
                ? 'Sign in to continue drawing' 
                : 'Create your account to start drawing'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Field (only for sign up) */}
            {!isSignin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isSignin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                />
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username (3-20 characters)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Username must be 3-20 characters long
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            {/* Forgot Password (only for sign in) */}
            {isSignin && (
              <div className="text-right">
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  {isSignin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isSignin ? 'Sign in' : 'Sign up'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              {isSignin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => router.push(isSignin ? '/signup' : '/signin')}
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
              >
                {isSignin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}