import { useState } from 'react'
import { Moon, Sun, Menu, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
  onLogout,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}: {
  notes: { id: string; title: string }[]
  selectedNoteId: string | null
  onSelectNote: (id: string) => void
  onNewNote: () => void
  onLogout: () => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}) {
  const { user } = useAuth()

  return (
    <aside className={`h-screen flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}> 
      {/* Top: Dark mode toggle and collapse button */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
        </button>
        <button
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={onNewNote}
          className={`m-4 w-full flex items-center gap-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition ${collapsed ? 'justify-center' : ''}`}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && 'New Note'}
        </button>
        <ul className="space-y-1 px-2">
          {notes.map(note => (
            <li key={note.id}>
              <button
                onClick={() => onSelectNote(note.id)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-800 transition ${selectedNoteId === note.id ? 'bg-blue-100 dark:bg-gray-800 font-semibold' : ''} ${collapsed ? 'truncate' : ''}`}
                title={note.title}
              >
                {collapsed ? note.title.charAt(0).toUpperCase() : note.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Account/Profile section */}
      <div className="p-4 border-t dark:border-gray-800 flex flex-col items-center">
        {!collapsed && (
          <div className="mb-2 text-xs text-gray-600 dark:text-gray-300 truncate w-full text-center">{user?.email}</div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
} 