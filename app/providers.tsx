'use client';

import { ThemeProvider } from "../contexts/ThemeContext"; // Adjust path if necessary
import { AuthProvider } from "../contexts/AuthContext";   // Adjust path if necessary
// import { Toaster } from 'react-hot-toast'; // If you were using this, include it here

export function ClientSideProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        {/* <Toaster position="bottom-right" /> */}
      </AuthProvider>
    </ThemeProvider>
  );
} 