'use client';

import { AlertCircle } from 'lucide-react';
import React from 'react';

interface ErrorMessageProps {
  error: string | null;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  // Map technical error messages to user-friendly messages
  const getFriendlyMessage = (error: string): string => {
    if (error.includes('invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    }
    if (error.includes('email not confirmed')) {
      return 'Please confirm your email address before signing in.';
    }
    if (error.includes('rate limit exceeded')) {
      return 'Too many attempts. Please try again later.';
    }
    if (error.includes('database error')) {
      return 'Something went wrong. Please try again later.';
    }
    if (error.includes('network error')) {
      return 'Network error. Please check your connection and try again.';
    }
    // Default message for unknown errors
    return 'An error occurred. Please try again.';
  };

  return (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-sm text-red-400">{getFriendlyMessage(error)}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto text-red-400 hover:text-red-300"
            aria-label="Dismiss error"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 