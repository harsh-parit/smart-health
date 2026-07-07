/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const {
    user,
    authLoading,
    isDemoMode,
    isDemoOpen,
    setIsDemoMode,
    setIsDemoOpen,
    signOutUser
  } = useAuthContext();

  return {
    user,
    loading: authLoading,
    isAuthenticated: !!user,
    isDemoMode,
    isDemoOpen,
    setIsDemoMode,
    setIsDemoOpen,
    signOut: signOutUser
  };
}
