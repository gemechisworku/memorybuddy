import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Note } from '../types/note'
import { useAuth } from '../contexts/AuthContext'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchNotes()
    }
  }, [user])

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return
    }

    setNotes(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (editingNote) {
      const { error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', editingNote.id)

      if (!error) {
        setEditingNote(null)
        await fetchNotes()
      }
    } else {
      const { error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            user_id: user.id,
          },
        ])

      if (!error) {
        await fetchNotes()
      }
    }

    setTitle('')
    setContent('')
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (!error) {
      await fetchNotes()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {editingNote ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded p-4 space-y-2">
            <h3 className="font-bold text-lg">{note.title}</h3>
            <p className="text-gray-600">{note.content}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 