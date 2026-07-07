/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Activity, ArrowRight, Github } from 'lucide-react';
import { ActiveModalType } from '../types';

interface NavbarProps {
  onGetStarted: (type: ActiveModalType) => void;
  onOpenDemo?: () => void;
}

export default function Navbar({ onGetStarted, onOpenDemo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Impact', href: '#impact' },
    { name: 'Technology', href: '#technology' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <a 
            href="#" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
            aria-label="Smart Health AI Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white relative shadow-md shadow-blue-500/15 group-hover:scale-105 transition-all">
              <Activity className="w-5.5 h-5.5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors block">
                Smart Health AI
              </span>
              <span className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest leading-none">
                Google Cloud Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors tracking-wide font-sans relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 hover:after:w-full after:transition-all after:duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Call buttons for Desktop */}
          <div className="hidden md:flex items-center gap-3.5">
            <a
              href="https://github.com/harsh-parit/smart-health"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl py-2 px-4 text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="GitHub Repository (opens in a new tab)"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {!import.meta.env.PROD && onOpenDemo && (
              <button
                onClick={onOpenDemo}
                className="border border-amber-300 hover:border-amber-400 bg-amber-50/60 hover:bg-amber-50 text-amber-900 font-bold rounded-xl py-2 px-4 text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                aria-label="Launch Demo Sandbox"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Sandbox</span>
              </button>
            )}

            <button
              onClick={() => onGetStarted('get-started')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-2 px-5 text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Get Started with onboarding"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hamburger Menu Trigger for Mobile */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
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
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2">
                  Intelligence System
                </span>
                
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={toggleMenu}
                      className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors block py-1"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom drawer footer content */}
              <div className="space-y-3.5">
                <a
                  href="https://github.com/harsh-parit/smart-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-slate-200 bg-white text-slate-700 font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
                  onClick={toggleMenu}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                {!import.meta.env.PROD && onOpenDemo && (
                  <button
                    onClick={() => {
                      toggleMenu();
                      onOpenDemo();
                    }}
                    className="w-full border border-amber-300 bg-amber-50 text-amber-900 font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
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
                  className="w-full bg-blue-600 text-white font-bold rounded-xl py-3 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-mono text-center pt-2">
                  <span>GOOGLE HEALTH BLUEPRINT</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
