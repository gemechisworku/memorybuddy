'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// Dynamically import SimpleMDE with no SSR
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { ssr: false }
)

interface NoteEditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  noteId: string
}

export default function NoteEditor({ content, onChange, onSave, noteId }: NoteEditorProps) {
  const [localContent, setLocalContent] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update local content when prop changes (e.g., when switching notes)
  useEffect(() => {
    setLocalContent(content)
    setHasChanges(false)
    // Clear any existing timeout when switching notes
    if (saveTimeout) {
      clearTimeout(saveTimeout)
      setSaveTimeout(null)
    }
  }, [content])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  const debouncedSave = useCallback(() => {
    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      if (hasChanges) {
        onChange(localContent) // Update parent state
        onSave() // Save to database
        setHasChanges(false)
      }
    }, 10000) // 10 seconds

    setSaveTimeout(timeout)
  }, [hasChanges, localContent, onChange, onSave, saveTimeout])

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
    debouncedSave()
  }, [debouncedSave])

  const handleManualSave = useCallback(() => {
    if (hasChanges) {
      // Clear any pending auto-save
      if (saveTimeout) {
        clearTimeout(saveTimeout)
        setSaveTimeout(null)
      }
      onChange(localContent) // Update parent state
      onSave() // Save to database
      setHasChanges(false)
    }
  }, [hasChanges, localContent, onChange, onSave, saveTimeout])

  // Add keyboard shortcut for manual save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleManualSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleManualSave])

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
            onClick={handleManualSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      )}
      {editor}
    </div>
  )
} 