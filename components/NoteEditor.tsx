import React, { useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import ReactMarkdown from 'react-markdown'

export default function NoteEditor({
  value,
  onChange,
  onSave,
  onDelete,
  isNew,
  loading,
}: {
  value: { title: string; content: string }
  onChange: (v: { title: string; content: string }) => void
  onSave: () => void
  onDelete?: () => void
  isNew?: boolean
  loading?: boolean
}) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <input
        className="mb-4 p-2 text-xl font-bold border-b bg-transparent dark:bg-transparent outline-none dark:text-white"
        placeholder="Title..."
        value={value.title}
        onChange={e => onChange({ ...value, title: e.target.value })}
        disabled={loading}
      />
      <div className="flex items-center gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${showPreview ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-500 text-white'} transition`}
          onClick={() => setShowPreview(false)}
        >
          Edit
        </button>
        <button
          className={`px-3 py-1 rounded ${showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'} transition`}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
      </div>
      <div className="flex-1 mb-4">
        {showPreview ? (
          <div className="prose dark:prose-invert max-w-none h-full overflow-y-auto bg-white dark:bg-gray-900 p-2 rounded">
            <ReactMarkdown>{value.content || ''}</ReactMarkdown>
          </div>
        ) : (
          <SimpleMDE
            value={value.content}
            onChange={content => onChange({ ...value, content })}
            options={{
              spellChecker: false,
              minHeight: '200px',
              maxHeight: '400px',
              status: false,
              autofocus: true,
              placeholder: 'Write your note in markdown...'
            }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          onClick={onSave}
          disabled={loading}
        >
          {isNew ? 'Create' : 'Save'}
        </button>
        {!isNew && onDelete && (
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
} 