/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './layouts/Navbar';
import HeroSection from './features/landing/HeroSection';
import FeatureCards from './features/landing/FeatureCards';
import VisionSection from './features/landing/VisionSection';
import VisionModal from './features/landing/VisionModal';
import Footer from './layouts/Footer';
import LoginPage from './pages/LoginPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import CitizenDashboard from './features/citizen/CitizenDashboard';
import AshaDashboard from './features/asha/AshaDashboard';
import DoctorDashboard from './features/doctor/DoctorDashboard';
import DhoDashboard from './features/dho/DhoDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import DemoModeModal from './features/demo/DemoModeModal';
import DemoControlCenter from './features/demo/DemoControlCenter';
import { AuthorizationService } from './services/AuthorizationService';
import { ActiveModalType, UserProfile, UserRole } from './types';
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
  
  // RBAC profile states
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Demo Mode States
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sh_is_demo_mode', isDemoMode ? 'true' : 'false');
    (window as any).sh_is_demo_mode = isDemoMode;
  }, [isDemoMode]);
  
  // Custom metadata from AI Studio context
  const defaultUserEmail = 'harshparit@gmail.com';

  useEffect(() => {
    if (isDemoMode) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);

      if (!firebaseUser) {
        // If not logged in and not on landing, we must return to login
        setUserProfile(null);
        setProfileLoading(false);
        setView((currentView) => {
          if (currentView !== 'landing' && currentView !== 'login') {
            return 'login';
          }
          return currentView;
        });
      }
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  // Fetch or setup User Profile whenever authentication changes
  useEffect(() => {
    if (isDemoMode) return;

    if (!user) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const profile = await AuthorizationService.getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          // Sync lastLogin timestamp
          await AuthorizationService.updateLastLogin(user.uid);
          
          // Automatically redirect to the correct dashboard if they log in
          setView((currentView) => {
            if (currentView === 'landing' || currentView === 'login' || currentView === 'role-selection') {
              switch (profile.role) {
                case 'citizen': return 'citizen-dashboard';
                case 'asha': return 'asha-dashboard';
                case 'doctor': return 'doctor-dashboard';
                case 'districtOfficer': return 'dho-dashboard';
              }
            }
            return currentView;
          });
        } else {
          // Profile is missing, route to role-selection to set their role gracefully
          setUserProfile(null);
          setView('role-selection');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, isDemoMode]);

  const handleOpenModal = (type: ActiveModalType) => {
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
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      setUserProfile(null);
      setView('landing');
      return;
    }
    try {
      await signOut(auth);
      setView('landing');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSignOutToLogin = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      setUserProfile(null);
      setView('login');
      return;
    }
    try {
      await signOut(auth);
      setView('login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleSelectRole = async (selectedId: 'citizen' | 'asha' | 'doctor' | 'dho') => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const mappedRole = AuthorizationService.mapSelectionIdToRole(selectedId);
      const profile = await AuthorizationService.createUserProfile(
        user.uid,
        user.displayName || user.email?.split('@')[0] || 'User',
        user.email || '',
        mappedRole
      );
      setUserProfile(profile);

      // Force view transition to selected dashboard
      switch (mappedRole) {
        case 'citizen': setView('citizen-dashboard'); break;
        case 'asha': setView('asha-dashboard'); break;
        case 'doctor': setView('doctor-dashboard'); break;
        case 'districtOfficer': setView('dho-dashboard'); break;
      }
    } catch (err) {
      console.error('Error creating user profile role:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleNavigateToDashboard = (role: UserRole) => {
    switch (role) {
      case 'citizen': setView('citizen-dashboard'); break;
      case 'asha': setView('asha-dashboard'); break;
      case 'doctor': setView('doctor-dashboard'); break;
      case 'districtOfficer': setView('dho-dashboard'); break;
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
      {isDemoMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between gap-4 shadow-md z-50 sticky top-0 animate-fade-in border-b border-amber-600/30">
          <div className="flex items-center gap-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping shrink-0" />
            <span className="shrink-0">DEMO PRESENTATION ACTIVE</span>
            <span className="opacity-40 shrink-0">|</span>
            <span className="text-[11px] font-sans truncate">Simulated Profile: <span className="font-bold underline">{userProfile?.name}</span> ({userProfile?.role === 'districtOfficer' ? 'District Health Officer' : userProfile?.role})</span>
          </div>
          <button 
            onClick={() => {
              setIsDemoMode(false);
              setUser(null);
              setUserProfile(null);
              setView('landing');
            }}
            className="bg-slate-950 hover:bg-slate-900 text-white px-3.5 py-1 rounded-full text-[10px] font-sans font-extrabold tracking-wide uppercase transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
          >
            Exit Sandbox
          </button>
        </div>
      )}

      {view === 'landing' && (
        <>
          {/* 1. Responsive Navigation Bar */}
          <Navbar onGetStarted={handleGetStarted} onOpenDemo={() => setIsDemoOpen(true)} />

          {/* 2. Hero Section & Dashboard Visualizer */}
          <HeroSection onGetStarted={handleGetStarted} onOpenDemo={() => setIsDemoOpen(true)} />

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
          onLoginSuccess={() => {
            // After successful login, if profile loads, useEffect will auto-redirect,
            // otherwise route to role-selection.
            setView('role-selection');
          }} 
          onBackToLanding={() => setView('landing')} 
        />
      )}

      {view === 'role-selection' && (
        <ProtectedRoute user={user} loading={authLoading} onRedirect={() => setView('login')}>
          <RoleSelectionPage 
            onBackToLogin={handleSignOutToLogin} 
            onLogout={handleSignOutToLanding} 
            onSelectRole={handleSelectRole}
          />
        </ProtectedRoute>
      )}

      {view === 'citizen-dashboard' && (
        <ProtectedRoute user={user} loading={authLoading} onRedirect={() => setView('login')}>
          <RoleGuard 
            userProfile={userProfile} 
            allowedRoles={['citizen']} 
            loading={profileLoading}
            onNavigateToDashboard={handleNavigateToDashboard}
            onBackToRoles={() => setView('role-selection')}
          >
            <CitizenDashboard 
              onBackToRoles={() => setView('role-selection')} 
              onLogout={handleSignOutToLanding} 
            />
          </RoleGuard>
        </ProtectedRoute>
      )}

      {view === 'asha-dashboard' && (
        <ProtectedRoute user={user} loading={authLoading} onRedirect={() => setView('login')}>
          <RoleGuard 
            userProfile={userProfile} 
            allowedRoles={['asha']} 
            loading={profileLoading}
            onNavigateToDashboard={handleNavigateToDashboard}
            onBackToRoles={() => setView('role-selection')}
          >
            <AshaDashboard 
              onBackToRoles={() => setView('role-selection')} 
              onLogout={handleSignOutToLanding} 
            />
          </RoleGuard>
        </ProtectedRoute>
      )}

      {view === 'doctor-dashboard' && (
        <ProtectedRoute user={user} loading={authLoading} onRedirect={() => setView('login')}>
          <RoleGuard 
            userProfile={userProfile} 
            allowedRoles={['doctor']} 
            loading={profileLoading}
            onNavigateToDashboard={handleNavigateToDashboard}
            onBackToRoles={() => setView('role-selection')}
          >
            <DoctorDashboard 
              onBackToRoles={() => setView('role-selection')} 
              onLogout={handleSignOutToLanding} 
            />
          </RoleGuard>
        </ProtectedRoute>
      )}

      {view === 'dho-dashboard' && (
        <ProtectedRoute user={user} loading={authLoading} onRedirect={() => setView('login')}>
          <RoleGuard 
            userProfile={userProfile} 
            allowedRoles={['districtOfficer']} 
            loading={profileLoading}
            onNavigateToDashboard={handleNavigateToDashboard}
            onBackToRoles={() => setView('role-selection')}
          >
            <DhoDashboard 
              onBackToRoles={() => setView('role-selection')} 
              onLogout={handleSignOutToLanding} 
            />
          </RoleGuard>
        </ProtectedRoute>
      )}

      <DemoModeModal 
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onSelectDemoUser={({ user: demoUser, profile: demoProfile }) => {
          setIsDemoMode(true);
          setUser(demoUser);
          setUserProfile(demoProfile);
          
          // Route immediately to the dashboard of the selected role
          switch (demoProfile.role) {
            case 'citizen': setView('citizen-dashboard'); break;
            case 'asha': setView('asha-dashboard'); break;
            case 'doctor': setView('doctor-dashboard'); break;
            case 'districtOfficer': setView('dho-dashboard'); break;
          }
        }}
      />

      {isDemoMode && <DemoControlCenter />}
    </div>
  );
}

