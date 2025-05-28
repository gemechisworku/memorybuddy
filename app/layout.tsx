'use client'

import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import Sidebar from '../components/Sidebar'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    // Apply dark mode class to html element
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Don't show sidebar on login page
  const showSidebar = user && pathname !== '/login'

  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <body className="bg-white dark:bg-gray-900">
        <AuthProvider>
          <div className="flex h-screen">
            {showSidebar && (
              <Sidebar
                notes={[]} // This will be populated by the NotesList component
                selectedNoteId={null}
                onSelectNote={() => {}}
                onNewNote={() => {}}
                onLogout={() => {}}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 