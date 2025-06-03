'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;

      if (!user) {
        console.log('AdminLayout: No user, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        console.log('AdminLayout: Checking admin status for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        console.log('AdminLayout: Profile check result:', { profile, error });

        if (error || !profile?.is_admin) {
          console.log('AdminLayout: Not an admin, redirecting to notes');
          router.push('/notes');
          return;
        }

        console.log('AdminLayout: Admin access granted');
        setIsChecking(false);
      } catch (error) {
        console.error('AdminLayout: Error checking admin status:', error);
        router.push('/notes');
      }
    };

    checkAdminStatus();
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
} 