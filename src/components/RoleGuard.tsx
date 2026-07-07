import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ArrowLeft, KeyRound, Activity } from 'lucide-react';
import { UserRole, UserProfile } from '../services/AuthorizationService';

interface RoleGuardProps {
  userProfile: UserProfile | null;
  allowedRoles: UserRole[];
  loading: boolean;
  onNavigateToDashboard: (role: UserRole) => void;
  onBackToRoles: () => void;
  children: React.ReactNode;
}

/**
 * Reusable RoleGuard component for RBAC verification.
 * 1. Displays a loading state when profile details are fetching.
 * 2. Compares the user profile role with allowed roles.
 * 3. Shows a polished, professional 403 Access Denied page with recovery paths if unauthorized.
 */
export default function RoleGuard({
  userProfile,
  allowedRoles,
  loading,
  onNavigateToDashboard,
  onBackToRoles,
  children
}: RoleGuardProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ec003f] flex items-center justify-center text-white relative shadow-xl shadow-red-500/20 animate-pulse">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-900 tracking-tight text-lg">Smart Health AI</h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">Authorizing User Workspace</p>
          </div>
          <p className="text-xs text-slate-500 font-medium">Resolving credentials from clinical registry...</p>
        </div>
      </div>
    );
  }

  // Handle missing user profiles gracefully
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-8 text-center space-y-6"
        >
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <KeyRound className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight">Profile Not Completed</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't resolve a valid clinical profile for your account. Please choose a workspace role to initialize your record.
            </p>
          </div>
          <button
            onClick={onBackToRoles}
            className="w-full bg-[#ec003f] hover:bg-[#d40039] text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-red-500/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Role Selection</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const isAuthorized = allowedRoles.includes(userProfile.role);

  if (!isAuthorized) {
    // Determine friendly name of current and required roles
    const getFriendlyRoleName = (role: UserRole) => {
      switch (role) {
        case 'citizen': return 'Citizen (Patient Portal)';
        case 'asha': return 'ASHA Worker';
        case 'doctor': return 'Doctor (Clinical Copilot)';
        case 'districtOfficer': return 'District Health Officer';
        default: return role;
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Dark Security Gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900/40 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full bg-slate-900 border border-slate-800 shadow-3xl rounded-[2.5rem] p-8 md:p-10 text-center relative z-10"
        >
          {/* Header Shield Alert Icon */}
          <div className="mx-auto w-16 h-16 rounded-[1.25rem] bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          {/* Security Heading */}
          <div className="space-y-2 mb-8">
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-semibold">
              403 Forbidden Access
            </span>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">
              Access Denied
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your security clearance level does not authorize access to this medical workspace.
            </p>
          </div>

          {/* Identity Credentials Block */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 mb-8 font-mono text-[11px] leading-relaxed">
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500 uppercase">Identified UID:</span>
              <span className="text-slate-300 font-semibold">{userProfile.uid.substring(0, 10)}...</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500 uppercase">Registered Email:</span>
              <span className="text-slate-300">{userProfile.email}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-2">
              <span className="text-slate-500 uppercase">Assigned Role:</span>
              <span className="text-red-400 font-bold">{getFriendlyRoleName(userProfile.role)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 uppercase">Required Role(s):</span>
              <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                {allowedRoles.map(r => r === 'districtOfficer' ? 'DHO' : r.toUpperCase()).join(' | ')}
              </span>
            </div>
          </div>

          {/* Action Recovery Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigateToDashboard(userProfile.role)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/15 cursor-pointer"
            >
              <span>Return to Correct Dashboard</span>
            </button>
            <button
              onClick={onBackToRoles}
              className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 font-bold py-3 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Workspace</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
