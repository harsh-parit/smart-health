/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from '../layouts/Navbar';
import HeroSection from '../features/landing/HeroSection';
import FeatureCards from '../features/landing/FeatureCards';
import VisionSection from '../features/landing/VisionSection';
import VisionModal from '../features/landing/VisionModal';
import Footer from '../layouts/Footer';
import { useAuth } from '../hooks/useAuth';
import { ActiveModalType } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const { user, setIsDemoOpen } = useAuth();
  
  const defaultUserEmail = 'harshparit@gmail.com';

  const handleOpenModal = (type: ActiveModalType) => {
    if (type === 'get-started') {
      onGetStarted();
    } else {
      setActiveModal(type);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* 1. Responsive Navigation Bar */}
      <Navbar onGetStarted={handleOpenModal} onOpenDemo={() => setIsDemoOpen(true)} />

      {/* 2. Hero Section & Dashboard Visualizer */}
      <HeroSection onGetStarted={onGetStarted} onOpenDemo={() => setIsDemoOpen(true)} />

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
  );
}
