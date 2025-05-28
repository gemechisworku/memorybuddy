'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Settings, 
  User,
  LogOut
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`
          flex flex-col
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`${collapsed ? 'hidden' : 'block'}`}>
            <Logo />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`
                w-full flex items-center px-3 py-2 rounded-lg
                ${pathname === item.path 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
                transition-colors duration-150
              `}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center px-3 py-2 rounded-lg
              text-gray-700 hover:bg-gray-100
              transition-colors duration-150
            `}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 