'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Settings, 
  User,
  LogOut,
  Moon,
  Sun
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { supabase } from '../lib/supabase'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    { 
      label: 'Notes', 
      icon: FileText, 
      path: '/',
      onClick: () => router.push('/')
    },
    { 
      label: 'Account', 
      icon: User, 
      path: '/account',
      onClick: () => router.push('/account')
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      onClick: () => router.push('/settings')
    }
  ]

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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`
          flex flex-col
          bg-white dark:bg-gray-800
          shadow-lg
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-72'}
          relative
        `}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div className={`${collapsed ? 'hidden' : 'block'}`}>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                w-full flex items-center px-4 py-3 rounded-xl
                ${pathname === item.path 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
                transition-all duration-150
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon size={20} className={`shrink-0 ${pathname === item.path ? 'text-blue-600 dark:text-blue-400' : ''}`} />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          {!collapsed && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center px-4 py-3 rounded-xl
              text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400
              transition-all duration-150
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="h-full p-8">
          {children}
        </div>
      </div>
    </div>
  )
} 