/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

export function useRole() {
  const {
    userProfile,
    profileLoading,
    selectRole
  } = useAuthContext();

  const isRole = (role: UserRole) => {
    return userProfile?.role === role;
  };

  return {
    profile: userProfile,
    loading: profileLoading,
    role: userProfile?.role || null,
    isCitizen: isRole('citizen'),
    isAsha: isRole('asha'),
    isDoctor: isRole('doctor'),
    isDistrictOfficer: isRole('districtOfficer'),
    selectRole,
    isRole
  };
}
