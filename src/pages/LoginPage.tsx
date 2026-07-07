/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export default function LoginPage({ onLoginSuccess, onBackToLanding }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      let friendlyError = err.message;
      if (err.code === 'auth/user-not-found') {
        friendlyError = 'No user found with this email. Click "Create Account" below to register.';
      } else if (err.code === 'auth/wrong-password') {
        friendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-credential') {
        friendlyError = 'Invalid credentials. Please check your email and password.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendlyError = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Please enter a valid email address.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-slate-100 shadow-2xl rounded-[2.25rem] p-8 sm:p-10 relative z-10"
      >
        {/* Back Link Button */}
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all flex items-center justify-center"
          title="Back to Landing Page"
          disabled={loading}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mt-4 mb-8">
          {/* Logo element resembling landing page navbar */}
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white relative shadow-lg shadow-blue-500/15 mb-3">
            <Activity className="w-6 h-6" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="font-display font-bold text-slate-900 tracking-tight text-lg leading-tight">
            Smart Health AI
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
            Healthcare Intelligence Portal
          </span>
          
          <h2 className="text-2xl font-display font-extrabold text-slate-800 mt-6 tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-440 mt-1 max-w-[280px]">
            {isSignUp 
              ? 'Sign up to register your secure localized health credential.'
              : 'Please sign in to access your secure localized health dashboard.'
            }
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-2xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@smarthealth.org"
                className="w-full bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-2xl pl-10 pr-4 py-3 text-sm transition-all outline-none text-slate-800 font-sans disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Password
              </label>
              {!isSignUp && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setError('To reset your password, contact administrative IT support.');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 rounded-2xl pl-10 pr-4 py-3 text-sm transition-all outline-none text-slate-800 font-sans disabled:opacity-60"
              />
            </div>
          </div>

          {/* Continue button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-2xl py-3.5 px-4 text-sm transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Continue'}</span>
            )}
          </button>
        </form>

        {/* Divider line */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            or
          </span>
        </div>

        {/* Continue with Google button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 active:scale-[0.98] text-slate-700 font-semibold rounded-2xl py-3 px-4 text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {/* Custom vector-styled Google logo representation */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.55 0 2.95.53 4.05 1.58l3.03-3.03C17.25 1.93 14.83 1 12 1 7.35 1 3.42 3.67 1.48 7.57l3.77 2.92C6.15 7.15 8.85 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.45 12.3c0-.82-.07-1.6-.22-2.3H12v4.4h6.43c-.28 1.44-1.1 2.66-2.33 3.47l3.63 2.82c2.12-1.95 3.35-4.83 3.35-8.39z"
            />
            <path
              fill="#FBBC05"
              d="M5.25 14.65c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.48 7.13C.53 9.04 0 11.17 0 13.43c0 2.27.53 4.4 1.48 6.31l3.77-2.92l.002-.17z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.63-2.82c-1.01.68-2.31 1.09-3.96 1.09-3.15 0-5.85-2.11-6.75-5.45l-3.77 2.92C3.42 20.33 7.35 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Create Account / Sign In link footer block */}
        <div className="text-center mt-8 text-xs text-slate-500">
          {isSignUp ? (
            <>
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsSignUp(false);
                }}
                className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setIsSignUp(true);
                }}
                className="text-blue-600 font-semibold hover:underline bg-transparent border-none cursor-pointer"
              >
                Create Account
              </button>
            </>
          )}
        </div>

        {/* Clinical Privacy Badge */}
        <div className="flex items-center justify-center gap-1.5 mt-8 pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>FHIR Compliant End-to-End Encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
