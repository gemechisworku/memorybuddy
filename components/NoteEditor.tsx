'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

// Dynamically import SimpleMDE with no SSR
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

interface NoteEditorProps {
  content: string
  onChange: (content: string) => void
  onSave: (content: string) => Promise<boolean>
  noteId: string
}

export default function NoteEditor({ content, onChange, onSave, noteId }: NoteEditorProps) {
  const [localContent, setLocalContent] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Update local content when prop changes (e.g., when switching notes)
  useEffect(() => {
    setLocalContent(content)
    setHasChanges(false)
  }, [content, noteId])

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    
    let toastId = toast.loading('Saving changes...');
    setIsSaving(true);
    
    try {
      // Update parent state
      onChange(localContent)
      
      // Save to database with current local content
      const success = await onSave(localContent)
      
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
      setLocalContent(content)
    } finally {
      setIsSaving(false)
    }
  }

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
      key={noteId}
      value={localContent}
      onChange={handleChange}
      options={editorOptions}
      className="h-full"
    />
  ), [noteId, localContent, handleChange, editorOptions])

  return (
    <div className="h-full relative">
      {hasChanges && (
        <div className="absolute top-2 right-2 z-10">
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
        </div>
      )}
      {editor}
    </div>
  )
} 