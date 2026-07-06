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
import { ActiveModalType } from './types';

export default function App() {
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  
  // Custom metadata from AI Studio context
  const userEmail = 'harshparit@gmail.com';

  const handleOpenModal = (type: ActiveModalType) => {
    setActiveModal(type);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden antialiased scroll-smooth">
      {/* 1. Responsive Navigation Bar */}
      <Navbar onGetStarted={handleOpenModal} />

      {/* 2. Hero Section & Dashboard Visualizer */}
      <HeroSection onGetStarted={handleOpenModal} />

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
    </div>
  );
}
