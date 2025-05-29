'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext'; // Corrected relative path
import LandingPage from './landing/page'; // Import the LandingPage component

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if done loading and user is present
    if (!loading && user) {
      router.replace('/notes');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // If not loading and no user, show LandingPage
  // If user becomes available, useEffect will redirect to /notes
  if (!user) {
    return <LandingPage />;
  }

  // Fallback, though useEffect should handle redirection
  return null;
}