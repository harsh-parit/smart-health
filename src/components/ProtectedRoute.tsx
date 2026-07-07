import React, { useEffect } from 'react';
import { User } from 'firebase/auth';
import { Activity } from 'lucide-react';

interface ProtectedRouteProps {
  user: User | null;
  loading: boolean;
  onRedirect: () => void;
  children: React.ReactNode;
}

/**
 * Reusable ProtectedRoute component for SPA view architecture.
 * If authentication is loading, displays a professional clinical loading state.
 * If the user is not authenticated, triggers the onRedirect callback.
 */
export default function ProtectedRoute({ 
  user, 
  loading, 
  onRedirect, 
  children 
}: ProtectedRouteProps) {
  useEffect(() => {
    if (!loading && !user) {
      onRedirect();
    }
  }, [user, loading, onRedirect]);

  if (loading) {
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
          <p className="text-xs text-slate-500 font-medium">Verifying security token...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
