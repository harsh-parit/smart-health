/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Activity, Globe, ArrowRight } from 'lucide-react';
import { ActiveModalType } from '../types';

interface NavbarProps {
  onGetStarted: (type: ActiveModalType) => void;
  onOpenDemo?: () => void;
}

export default function Navbar({ onGetStarted, onOpenDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Solutions', href: '#features' },
    { name: 'Concept & Vision', href: '#vision' },
    { name: 'Tech Stack', href: '#tech-stack' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white relative shadow-md shadow-blue-500/15 group-hover:scale-105 transition-all">
              <Activity className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 tracking-tight text-base group-hover:text-blue-600 transition-colors">
                Smart Health AI
              </span>
              <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                Google Health Hackathon
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors tracking-wide font-sans"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Call for Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {!import.meta.env.PROD && onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="border border-amber-300 hover:border-amber-400 bg-amber-50/60 hover:bg-amber-50 text-amber-900 font-semibold rounded-full py-2 px-5 text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Demo Sandbox</span>
              </button>
            )}
            <button
              onClick={() => onGetStarted('get-started')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full py-2 px-5 text-xs flex items-center gap-1.5 shadow-sm shadow-blue-500/10 transition-all active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hamburger Menu Trigger for Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click barrier */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-30 bg-slate-900 md:hidden"
            />
            
            {/* Drawer sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white border-l border-slate-100 p-6 pt-20 z-30 flex flex-col justify-between md:hidden"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Platform Navigation
                </span>
                
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={toggleMenu}
                      className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom drawer footer content */}
              <div className="space-y-4">
                {!import.meta.env.PROD && onOpenDemo && (
                  <button
                    onClick={() => {
                      toggleMenu();
                      onOpenDemo();
                    }}
                    className="w-full border border-amber-300 bg-amber-50 text-amber-900 font-semibold rounded-2xl py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Demo Sandbox</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    toggleMenu();
                    onGetStarted('get-started');
                  }}
                  className="w-full bg-blue-600 text-white font-semibold rounded-2xl py-3 text-xs flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <Globe className="w-3.5 h-3.5" />
                  <span>COMMUNITY CODE PORTAL</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
