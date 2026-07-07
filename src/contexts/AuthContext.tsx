/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthorizationService } from '../services/AuthorizationService';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  profileLoading: boolean;
  isDemoMode: boolean;
  isDemoOpen: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  setIsDemoOpen: (isOpen: boolean) => void;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  signOutUser: (targetView: 'landing' | 'login', setView: (v: any) => void) => Promise<void>;
  selectRole: (selectedId: 'citizen' | 'asha' | 'doctor' | 'dho', setView: (v: any) => void) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  useEffect(() => {
    const savedDemo = localStorage.getItem('sh_is_demo_mode') === 'true';
    setIsDemoMode(savedDemo);
    (window as any).sh_is_demo_mode = savedDemo;
  }, []);

  useEffect(() => {
    localStorage.setItem('sh_is_demo_mode', isDemoMode ? 'true' : 'false');
    (window as any).sh_is_demo_mode = isDemoMode;
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
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
          await AuthorizationService.updateLastLogin(user.uid);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, isDemoMode]);

  const signOutUser = async (targetView: 'landing' | 'login', setView: (v: any) => void) => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setUser(null);
      setUserProfile(null);
      setView(targetView);
      return;
    }
    try {
      await signOut(auth);
      setView(targetView);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const selectRole = async (selectedId: 'citizen' | 'asha' | 'doctor' | 'dho', setView: (v: any) => void) => {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        authLoading,
        profileLoading,
        isDemoMode,
        isDemoOpen,
        setIsDemoMode,
        setIsDemoOpen,
        setUser,
        setUserProfile,
        signOutUser,
        selectRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
