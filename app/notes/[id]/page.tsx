'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import AppLayout from '../../../components/AppLayout'
import NoteEditor from '../../../components/NoteEditor'
import Modal from '../../../components/Modal'

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [note, setNote] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const isNew = params.id === 'new'

  useEffect(() => {
    if (!isNew) {
      fetchNote()
    } else {
      setLoading(false)
    }
  }, [params.id])

  const fetchNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) setNote(data)
    } catch (error) {
      console.error('Error fetching note:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (isNew) {
        const { error } = await supabase
          .from('notes')
          .insert([
            {
              title: note.title || 'Untitled Note',
              content: note.content,
              user_id: user?.id,
            },
          ])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('notes')
          .update({
            title: note.title || 'Untitled Note',
            content: note.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.id)
        if (error) throw error
      }
      router.push('/')
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', params.id)
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error deleting note:', error)
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <NoteEditor
            value={note}
            onChange={setNote}
            onSave={handleSave}
            onDelete={!isNew ? () => setShowDeleteModal(true) : undefined}
            isNew={isNew}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Note"
        actions={
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>
      </Modal>
    </AppLayout>
  )
} 