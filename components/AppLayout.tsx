'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  FileText, 
  User,
  Moon,
  Sun,
  Menu,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  LogOut
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      setIsAdmin(profile?.is_admin || false);
    };
    checkAdminStatus();

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [user]);

  // Handle sidebar collapse
  const handleSidebarCollapse = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    // On mobile, close the sidebar after navigation
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const menuItems = [
    { 
      label: 'Notes', 
      icon: FileText, 
      path: '/notes',
      onClick: () => handleNavigation('/notes')
    },
    { 
      label: 'Account', 
      icon: User, 
      path: '/account',
      onClick: () => handleNavigation('/account')
    }
  ]

  if (isAdmin) {
    console.log('Adding admin dashboard to menu items');
    menuItems.push({ 
      label: 'Admin Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard',
      onClick: () => handleNavigation('/admin/dashboard')
    });
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ${
          isMobile
            ? isMobileSidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : isSidebarCollapsed
            ? 'w-16'
            : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              {!isSidebarCollapsed && (
                <Link href="/notes" className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">MemoryBuddy</span>
                </Link>
              )}
              {!isMobile && !isSidebarCollapsed && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
            </div>
            <button
              onClick={handleSidebarCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
              {!isSidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/login');
                }}
                className="mt-4 w-full flex items-center px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isMobile
            ? 'ml-0'
            : isSidebarCollapsed
            ? 'ml-16'
            : 'ml-64'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleMobileSidebarToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 