/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import VisionSection from './components/VisionSection';
import VisionModal from './components/VisionModal';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RoleSelectionPage from './components/RoleSelectionPage';
import { ActiveModalType } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'role-selection'>('landing');
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  
  // Custom metadata from AI Studio context
  const userEmail = 'harshparit@gmail.com';

  const handleOpenModal = (type: ActiveModalType) => {
    // If it's the get-started option, route directly to the login page
    if (type === 'get-started') {
      setView('login');
    } else {
      setActiveModal(type);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased scroll-smooth">
      {view === 'landing' && (
        <>
          {/* 1. Responsive Navigation Bar */}
          <Navbar onGetStarted={() => setView('login')} />

          {/* 2. Hero Section & Dashboard Visualizer */}
          <HeroSection onGetStarted={() => setView('login')} />

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
            userEmail={userEmail}
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
          onBackToLogin={() => setView('login')} 
          onLogout={() => setView('landing')} 
        />
      )}
    </div>
  );
}
