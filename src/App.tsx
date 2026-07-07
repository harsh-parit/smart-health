/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import VisionSection from './components/VisionSection';
import VisionModal from './components/VisionModal';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import CitizenDashboard from './components/CitizenDashboard';
import AshaDashboard from './components/AshaDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import DhoDashboard from './components/DhoDashboard';
import { ActiveModalType } from './types';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Activity } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<
    | 'landing'
    | 'login'
    | 'role-selection'
    | 'citizen-dashboard'
    | 'asha-dashboard'
    | 'doctor-dashboard'
    | 'dho-dashboard'
  >('landing');
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Custom metadata from AI Studio context
  const defaultUserEmail = 'harshparit@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (firebaseUser) {
        // If logged in and on landing or login, go directly to role selection
        setView((currentView) => {
          if (currentView === 'landing' || currentView === 'login') {
            return 'role-selection';
          }
          return currentView;
        });
      } else {
        // If not logged in and not on landing, we must return to login
        setView((currentView) => {
          if (currentView !== 'landing' && currentView !== 'login') {
            return 'login';
          }
          return currentView;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (type: ActiveModalType) => {
    // If it's the get-started option, route directly to the login page (or role-selection if already logged in)
    if (type === 'get-started') {
      if (user) {
        setView('role-selection');
      } else {
        setView('login');
      }
    } else {
      setActiveModal(type);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleGetStarted = () => {
    if (user) {
      setView('role-selection');
    } else {
      setView('login');
    }
  };

  const handleSignOutToLanding = async () => {
    try {
      await signOut(auth);
      setView('landing');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSignOutToLogin = async () => {
    try {
      await signOut(auth);
      setView('login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white relative shadow-xl shadow-blue-500/20 animate-pulse">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-900 tracking-tight text-lg">Smart Health AI</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Healthcare Intelligence Portal</p>
          </div>
          <p className="text-xs text-slate-500 font-medium">Verifying clinical credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased scroll-smooth">
      {view === 'landing' && (
        <>
          {/* 1. Responsive Navigation Bar */}
          <Navbar onGetStarted={handleGetStarted} />

          {/* 2. Hero Section & Dashboard Visualizer */}
          <HeroSection onGetStarted={handleGetStarted} />

          {/* 3. Three Core Solution Feature Cards */}
          <FeatureCards onSelectFeature={handleOpenModal} />

          {/* 4. Strategic Vision & Technology Specification */}
          <VisionSection />

          {/* 5. Professional Medical / Technical Footer */}
          <Footer />

          {/* 6. Dynamic Onboarding and Specification Dialog Sheet */}
          <VisionModal 
            activeModal={activeModal} 
            onClose={handleCloseModal} 
            userEmail={user?.email || defaultUserEmail}
          />
        </>
      )}

      {view === 'login' && (
        <LoginPage 
          onLoginSuccess={() => setView('role-selection')} 
          onBackToLanding={() => setView('landing')} 
        />
      )}

      {view === 'role-selection' && (
        <RoleSelectionPage 
          onBackToLogin={handleSignOutToLogin} 
          onLogout={handleSignOutToLanding} 
          onSelectRole={(roleId) => {
            if (roleId === 'citizen') setView('citizen-dashboard');
            else if (roleId === 'asha') setView('asha-dashboard');
            else if (roleId === 'doctor') setView('doctor-dashboard');
            else if (roleId === 'dho') setView('dho-dashboard');
          }}
        />
      )}

      {view === 'citizen-dashboard' && (
        <CitizenDashboard 
          onBackToRoles={() => setView('role-selection')} 
          onLogout={handleSignOutToLanding} 
        />
      )}

      {view === 'asha-dashboard' && (
        <AshaDashboard 
          onBackToRoles={() => setView('role-selection')} 
          onLogout={handleSignOutToLanding} 
        />
      )}

      {view === 'doctor-dashboard' && (
        <DoctorDashboard 
          onBackToRoles={() => setView('role-selection')} 
          onLogout={handleSignOutToLanding} 
        />
      )}

      {view === 'dho-dashboard' && (
        <DhoDashboard 
          onBackToRoles={() => setView('role-selection')} 
          onLogout={handleSignOutToLanding} 
        />
      )}
    </div>
  );
}
