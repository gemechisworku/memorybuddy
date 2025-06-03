'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-semibold text-sky-400">MemoryBuddy</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-2 sm:gap-4"
            >
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
              Your Digital Memory Companion
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Capture your thoughts, organize your ideas, and never lose a moment of inspiration.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4"
            >
              <Link
                href="/login"
                className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors shadow-lg shadow-sky-500/25"
              >
                Get Started
                <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Quick Capture</h3>
              <p className="text-sm sm:text-base text-slate-400">Instantly capture your thoughts with our intuitive interface.</p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Smart Organization</h3>
              <p className="text-sm sm:text-base text-slate-400">Keep your notes organized with powerful search and categorization.</p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Secure & Private</h3>
              <p className="text-sm sm:text-base text-slate-400">Your notes are encrypted and protected with industry-standard security.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MemoryBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 