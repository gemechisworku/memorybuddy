'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AppLayout from '../components/AppLayout'

interface Note {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    try {
      const newNote = {
        title: 'Untitled Note',
        content: '',
        user_id: user?.id,
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single()

      if (error) throw error
      
      setNotes([data, ...notes])
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notes</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <button
              onClick={createNote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-150 shadow-sm"
            >
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No notes yet</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first note
              </p>
              <button
                onClick={createNote}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-150"
              >
                <Plus size={20} />
                Create Note
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(note.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
} 