/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  MapPin, 
  AlertTriangle, 
  FileCheck, 
  Clock, 
  ClipboardList, 
  ArrowLeft, 
  Bell, 
  LogOut, 
  Search,
  CheckCircle,
  Menu,
  X,
  User,
  Phone,
  Shield,
  HeartPulse,
  AlertCircle,
  Check,
  PlusCircle,
  Sparkles
} from 'lucide-react';

interface AshaDashboardProps {
  onBackToRoles: () => void;
  onLogout: () => void;
}

export default function AshaDashboard({ onBackToRoles, onLogout }: AshaDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'patients' | 'tasks'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Patient Registration UI states
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    abhaId: '',
    village: '',
    gramPanchayat: '',
    district: '',
    state: '',
    pinCode: '',
    pregnant: 'No' as 'Yes' | 'No',
    chronicDiseases: '',
    allergies: '',
    emergencyContact: ''
  });

  const navigationItems = [
    { id: 'home' as const, label: 'Dashboard Hub', icon: ClipboardList },
    { id: 'patients' as const, label: 'Patient Register', icon: Users },
    { id: 'tasks' as const, label: 'Task List', icon: FileCheck },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    
    if (!formData.age.trim()) {
      errors.age = 'Age is required';
    } else {
      const parsedAge = Number(formData.age);
      if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 125) {
        errors.age = 'Enter a valid age (1-125)';
      }
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.village.trim()) {
      errors.village = 'Village is required';
    }

    if (!formData.gramPanchayat.trim()) {
      errors.gramPanchayat = 'Gram Panchayat is required';
    }

    if (!formData.district.trim()) {
      errors.district = 'District is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.pinCode = 'Enter a valid 6-digit PIN code';
    }

    if (!formData.emergencyContact.trim()) {
      errors.emergencyContact = 'Emergency Contact is required';
    } else if (!/^\d{10}$/.test(formData.emergencyContact.trim())) {
      errors.emergencyContact = 'Enter a valid 10-digit emergency contact number';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error field
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success!
    setRegistrationSuccess(true);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Decorative glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-extrabold text-slate-900 text-sm">
            ASHA Hub
          </span>
        </div>

        <button
          onClick={onBackToRoles}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-all border border-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Roles</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 p-6 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white relative shadow-md shadow-emerald-500/10">
                <Users className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-display font-bold text-slate-950 tracking-tight text-xs leading-none block">
                  ASHA Portal
                </span>
                <span className="block text-[7px] font-mono text-slate-400 uppercase tracking-widest mt-0.5 leading-none">
                  Smart Health AI
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                    setIsRegistering(false);
                    setRegistrationSuccess(false);
                    setFormErrors({});
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/30' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer buttons */}
        <div className="space-y-2 border-t border-slate-50 pt-6">
          <button
            onClick={onBackToRoles}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-transparent cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Switch Role</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50/50 transition-all border border-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile menu drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 space-y-8 relative z-10 max-w-5xl mx-auto w-full">
        {isRegistering ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Patient Registration Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-5 gap-4">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setRegistrationSuccess(false);
                    setFormErrors({});
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/60 shadow-xs cursor-pointer mb-2 w-fit"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
                <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-emerald-600" />
                  Patient Registration
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Register a new community member in the outreach health network
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 bg-slate-100/60 border border-slate-200/40 px-3 py-2 rounded-xl h-fit">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure Local Intake</span>
              </div>
            </div>

            {registrationSuccess ? (
              /* Success View */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 max-w-2xl mx-auto text-center shadow-sm relative overflow-hidden space-y-8"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none" />
                
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/60 shadow-inner">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-display font-extrabold text-slate-900">Patient Registered Successfully!</h2>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                    Intake record successfully created and validated for local registry. Real-time synchronisation is currently simulated.
                  </p>
                </div>

                {/* Detail Summary Card */}
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-inner">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Full Name</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Age & Gender</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.age} Years • {formData.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mobile Number</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.mobileNumber}</span>
                  </div>
                  {formData.abhaId && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ABHA ID</span>
                      <span className="text-xs font-mono font-bold text-slate-800">{formData.abhaId}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Location</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.village}, {formData.gramPanchayat}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Pregnant</span>
                    <span className={`text-xs font-extrabold ${formData.pregnant === 'Yes' ? 'text-rose-600' : 'text-slate-600'}`}>
                      {formData.pregnant}
                    </span>
                  </div>
                  {formData.chronicDiseases && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Chronic Diseases</span>
                      <span className="text-xs font-extrabold text-slate-800 truncate max-w-[200px]">{formData.chronicDiseases}</span>
                    </div>
                  )}
                  {formData.allergies && (
                    <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Allergies</span>
                      <span className="text-xs font-extrabold text-slate-800 truncate max-w-[200px]">{formData.allergies}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Emergency Contact</span>
                    <span className="text-xs font-extrabold text-slate-800">{formData.emergencyContact}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRegistrationSuccess(false);
                      setFormData({
                        fullName: '',
                        age: '',
                        gender: '',
                        mobileNumber: '',
                        abhaId: '',
                        village: '',
                        gramPanchayat: '',
                        district: '',
                        state: '',
                        pinCode: '',
                        pregnant: 'No',
                        chronicDiseases: '',
                        allergies: '',
                        emergencyContact: ''
                      });
                      setFormErrors({});
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register Another</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setRegistrationSuccess(false);
                      setActiveTab('patients');
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>Go to Register</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Registration Form View */
              <form onSubmit={handleSave} className="space-y-8 max-w-3xl mx-auto">
                
                {/* PERSONAL DETAILS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-blue-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Personal Details</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Demographic Information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5" id="fullName">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Laxmi Bai"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.fullName ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5" id="age">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Age <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="125"
                        placeholder="e.g. 28"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.age ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.age && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.age}</span>
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5 md:col-span-2" id="gender">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex gap-2.5">
                        {['Female', 'Male', 'Other'].map((g) => {
                          const isSelected = formData.gender === g;
                          return (
                            <button
                              type="button"
                              key={g}
                              onClick={() => setFormData({ ...formData, gender: g })}
                              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-4 ring-blue-500/5 font-extrabold'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                      {formErrors.gender && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.gender}</span>
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5" id="mobileNumber">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-mono font-extrabold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${
                            formErrors.mobileNumber ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                          } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                        />
                      </div>
                      {formErrors.mobileNumber && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.mobileNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* ABHA ID (Optional) */}
                    <div className="space-y-1.5" id="abhaId">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>ABHA ID <span className="text-slate-400 lowercase italic font-normal">(Optional)</span></span>
                        <span className="text-[8px] tracking-normal text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-mono">
                          <Sparkles className="w-2.5 h-2.5" />
                          ABHA Card ID
                        </span>
                      </label>
                      <input
                        type="text"
                        maxLength={17}
                        placeholder="XX-XXXX-XXXX-XXXX"
                        value={formData.abhaId}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
                          if (val.length > 2 && val.length <= 6) {
                            val = `${val.slice(0, 2)}-${val.slice(2)}`;
                          } else if (val.length > 6 && val.length <= 10) {
                            val = `${val.slice(0, 2)}-${val.slice(2, 6)}-${val.slice(6)}`;
                          } else if (val.length > 10) {
                            val = `${val.slice(0, 2)}-${val.slice(2, 6)}-${val.slice(6, 10)}-${val.slice(10, 14)}`;
                          }
                          setFormData({ ...formData, abhaId: val });
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-mono font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                  </div>
                </div>

                {/* ADDRESS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-teal-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Residential Address</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Locality details within Outpost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Village */}
                    <div className="space-y-1.5" id="village">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Village <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sonagir"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.village ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.village && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.village}</span>
                        </p>
                      )}
                    </div>

                    {/* Gram Panchayat */}
                    <div className="space-y-1.5" id="gramPanchayat">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Gram Panchayat <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sonagir G.P."
                        value={formData.gramPanchayat}
                        onChange={(e) => setFormData({ ...formData, gramPanchayat: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.gramPanchayat ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.gramPanchayat && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.gramPanchayat}</span>
                        </p>
                      )}
                    </div>

                    {/* District */}
                    <div className="space-y-1.5" id="district">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        District <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Datia"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.district ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.district && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.district}</span>
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5" id="state">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Madhya Pradesh"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.state ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.state && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.state}</span>
                        </p>
                      )}
                    </div>

                    {/* PIN Code */}
                    <div className="space-y-1.5" id="pinCode">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        PIN Code <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit PIN code"
                        value={formData.pinCode}
                        onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
                        className={`w-full px-4 py-3 bg-slate-50 border ${
                          formErrors.pinCode ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                      />
                      {formErrors.pinCode && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.pinCode}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* HEALTH DETAILS SECTION */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-rose-50/20 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-extrabold text-slate-900 text-sm">Health Details</h2>
                      <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">Clinical risks and indicators</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Pregnant Yes / No */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Is the patient currently pregnant? <span className="text-rose-500">*</span></span>
                        {formData.pregnant === 'Yes' && (
                          <span className="text-[8px] tracking-normal text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded animate-pulse">
                            Antenatal Care Needed
                          </span>
                        )}
                      </label>
                      <div className="flex gap-2.5 max-w-xs">
                        {['No', 'Yes'].map((p) => {
                          const isSelected = formData.pregnant === p;
                          return (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setFormData({ ...formData, pregnant: p as 'Yes' | 'No' })}
                              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? p === 'Yes'
                                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs ring-4 ring-rose-500/5 font-extrabold'
                                    : 'bg-slate-800 border-slate-800 text-white shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Chronic Diseases */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Chronic Diseases <span className="text-slate-400 lowercase italic font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hypertension, Diabetes, Thyroid"
                        value={formData.chronicDiseases}
                        onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Allergies */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Allergies <span className="text-slate-400 lowercase italic font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-150 focus:border-emerald-500 focus:ring-emerald-100 focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-1.5 md:col-span-2" id="emergencyContact">
                      <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                        Emergency Contact Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-mono font-extrabold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit emergency phone number"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value.replace(/\D/g, '') })}
                          className={`w-full pl-12 pr-4 py-3 bg-slate-50 border ${
                            formErrors.emergencyContact ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                          } focus:bg-white focus:ring-4 rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400`}
                        />
                      </div>
                      {formErrors.emergencyContact && (
                        <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{formErrors.emergencyContact}</span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* BUTTONS: SAVE & CANCEL */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Registration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setRegistrationSuccess(false);
                      setFormErrors({});
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 shadow-xs"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        ) : (
          /* Normal Dashboard Views */
          <>
            {/* Upper Dashboard Header (Hidden on Mobile) */}
            <div className="hidden md:flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Community Outreach Platform
                </span>
                <h1 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight mt-0.5">
                  Welcome, ASHA Worker
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => alert("Notification feature coming in next sprint.")}
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl relative transition-all border border-slate-100 shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Today's Assigned Visits */}
                <div className="bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-50/30 to-transparent rounded-full pointer-events-none" />

                  <div className="flex items-center gap-2 mb-6">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Today's Assigned Visits
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                          Visit 1 • 09:30 AM
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-800 text-sm">Meera Devi</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Maternal health follow-up & vaccination check</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sector 2, Family Hub</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                          Visit 2 • 11:45 AM
                        </span>
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-800 text-sm">Rajesh Kumar</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Post-operative outpatient wound dressing</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sector 3, Outer Border</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/60 border border-slate-100/50 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                          Visit 3 • 02:00 PM
                        </span>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-800 text-sm">Sita Devi</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Infant immunization schedule & polio drops</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sector 2, Health Camp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => {
                        setIsRegistering(true);
                        setRegistrationSuccess(false);
                        setFormErrors({});
                        setFormData({
                          fullName: '',
                          age: '',
                          gender: '',
                          mobileNumber: '',
                          abhaId: '',
                          village: '',
                          gramPanchayat: '',
                          district: '',
                          state: '',
                          pinCode: '',
                          pregnant: 'No',
                          chronicDiseases: '',
                          allergies: '',
                          emergencyContact: ''
                        });
                      }}
                      className="bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Outreach</h3>
                        <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                          Register Patient
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => alert("Home visits logbook interface coming in next sprint.")}
                      className="bg-white border border-slate-100 hover:border-blue-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Itinerary</h3>
                        <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                          Home Visits
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => alert("High risk patients filter coming in next sprint.")}
                      className="bg-white border border-slate-100 hover:border-rose-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Triage</h3>
                        <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                          High Risk Patients
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => alert("Referral routing sheet coming in next sprint.")}
                      className="bg-white border border-slate-100 hover:border-purple-100 hover:shadow-lg rounded-2xl p-5 flex flex-col items-start text-left justify-between gap-6 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Advisory</h3>
                        <span className="text-sm font-display font-extrabold text-slate-850 mt-1 block">
                          Referrals
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Today's Tasks (Empty State) */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-mono pl-1">
                    Today's Tasks
                  </h2>

                  <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-3">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-slate-700 text-sm">
                      No pending tasks
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1 leading-normal">
                      All task queues, patient records audits, and demographic reports are successfully completed for today.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search registered patients by name or ID..."
                    disabled
                    className="bg-transparent border-none text-xs outline-none w-full text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <Users className="w-12 h-12 text-slate-300 mb-3" />
                  <h3 className="font-display font-bold text-slate-700 text-sm">Patient directory offline</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Real-time patient directories are configured. Secure patient roster streaming is coming in next sprint.
                  </p>
                  
                  <button
                    onClick={() => {
                      setIsRegistering(true);
                      setRegistrationSuccess(false);
                      setFormErrors({});
                      setFormData({
                        fullName: '',
                        age: '',
                        gender: '',
                        mobileNumber: '',
                        abhaId: '',
                        village: '',
                        gramPanchayat: '',
                        district: '',
                        state: '',
                        pinCode: '',
                        pregnant: 'No',
                        chronicDiseases: '',
                        allergies: '',
                        emergencyContact: ''
                      });
                    }}
                    className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 hover:shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Patient</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <FileCheck className="w-12 h-12 text-slate-300 mb-3" />
                  <h3 className="font-display font-bold text-slate-700 text-sm">No tasks pending</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    You have logged and closed all demographic audits and vaccine inventories for Sector 3 Outpost.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
