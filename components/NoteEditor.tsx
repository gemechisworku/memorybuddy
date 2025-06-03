'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Save, Eye, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'

// Dynamically import SimpleMDE with no SSR
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => Promise<boolean>;
  showPreview: boolean;
  onTogglePreview: () => void;
  onDelete: () => void;
}

export default function NoteEditor({ note, onSave, showPreview, onTogglePreview, onDelete }: NoteEditorProps) {
  const [localContent, setLocalContent] = useState(note.content)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Update local content when prop changes (e.g., when switching notes)
  useEffect(() => {
    setLocalContent(note.content)
    setHasChanges(false)
  }, [note.content, note.id])

  const handleSave = useCallback(async () => {
    if (!hasChanges || isSaving) return;
    
    const toastId = toast.loading('Saving changes...');
    setIsSaving(true);
    
    try {
      const updatedNote = {
        ...note,
        content: localContent
      };
      
      // Save to database with current local content
      const success = await onSave(updatedNote)
      
      if (success) {
        setHasChanges(false)
        toast.success('Changes saved successfully', { id: toastId })
      } else {
        throw new Error('Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('Failed to save changes', { id: toastId })
      // Revert local content to the last known good state
      setLocalContent(note.content)
    } finally {
      setIsSaving(false)
    }
  }, [hasChanges, isSaving, localContent, onSave, note])

  // SimpleMDE options
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    minHeight: '200px',
    maxHeight: '600px',
    status: false,
    autofocus: false,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'guide'
    ] as const,
  }), [])

  const handleChange = useCallback((newContent: string) => {
    setLocalContent(newContent)
    setHasChanges(true)
  }, [])

  // Add keyboard shortcut for manual save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Use a memo for the editor component to prevent unnecessary re-renders
  const editor = useMemo(() => (
    <SimpleMDE
      key={note.id}
      value={localContent}
      onChange={handleChange}
      options={editorOptions}
      className="h-full"
    />
  ), [note.id, localContent, handleChange, editorOptions])

  return (
    <div className="h-full relative">
      {/* Desktop Controls */}
      <div className="absolute top-2 right-2 z-10 hidden sm:flex items-center gap-2">
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-3 py-1.5 ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg transition-colors`}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-2 px-3 py-1.5 ${
            showPreview 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          } text-gray-700 dark:text-gray-300 rounded-lg transition-colors`}
        >
          {showPreview ? <Edit size={16} /> : <Eye size={16} />}
          {showPreview ? 'Edit' : 'Preview'}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* Mobile Controls */}
      <div className="sm:hidden flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePreview}
            className={`flex items-center gap-1 px-2 py-1.5 ${
              showPreview 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            } text-gray-700 dark:text-gray-300 rounded-lg transition-colors`}
          >
            {showPreview ? <Edit size={16} /> : <Eye size={16} />}
            <span className="text-xs">{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          {hasChanges && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1 px-2 py-1.5 ${
                isSaving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg transition-colors`}
            >
              <Save size={16} />
              <span className="text-xs">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          )}
        </div>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-2 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          <span className="text-xs">Delete</span>
        </button>
      </div>

      {/* Editor/Preview Content */}
      <div className="h-full sm:pt-12">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-4">
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown>{localContent || 'No content. Start typing!'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          editor
        )}
      </div>
    </div>
  )
} 