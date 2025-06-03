'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AppLayout from '../../components/AppLayout';
import NoteEditor from '../../components/NoteEditor';
import 'easymde/dist/easymde.min.css';
import { toast } from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isNoteListCollapsed, setIsNoteListCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);
  const { user } = useAuth();
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter notes based on debounced search term
  const filteredNotes = useMemo(() => {
    if (!debouncedSearchTerm) return notes;
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(lowerSearchTerm) ||
      note.content.toLowerCase().includes(lowerSearchTerm)
    );
  }, [notes, debouncedSearchTerm]);

  // Update selected note only when necessary
  useEffect(() => {
    if (filteredNotes.length > 0 && !selectedNote) {
      // Only set selectedNote if none is selected
      setSelectedNote(filteredNotes[0]);
    } else if (filteredNotes.length === 0 && selectedNote) {
      // If search results are empty, keep the current note if it exists in the original notes
      const noteStillExists = notes.some(n => n.id === selectedNote.id);
      if (!noteStillExists) {
        setSelectedNote(null);
      }
    } else if (selectedNote && !filteredNotes.some(n => n.id === selectedNote.id)) {
      // If the current selected note is no longer in filteredNotes, select the first available
      setSelectedNote(filteredNotes[0] || null);
    }
  }, [filteredNotes, selectedNote, notes]);

  const fetchNotes = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      // Only set selectedNote if none is currently selected
      if (data && data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedNote]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleNewNote = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title: 'Untitled Note',
            content: '',
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        await fetchNotes();
        setSearchTerm(''); // Clear search to show all notes
        setSelectedNote(data);
        setShowPreview(false);
        setMobileEditorOpen(true); // Open mobile editor for new note
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  }, [user?.id, fetchNotes]);

  const handleNoteSelect = useCallback((note: Note) => {
    setSelectedNote(note);
    setShowPreview(true);
    setMobileEditorOpen(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowPreview(true);
    setMobileEditorOpen(false);
  }, []);

  const handleSave = useCallback(async (note: Note) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id);

      if (error) throw error;
      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }, [fetchNotes]);

  const handleDelete = useCallback(async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      await fetchNotes();
      if (selectedNote?.id === noteId) {
        setSelectedNote(filteredNotes[0] || null);
      }
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note.');
    }
  }, [selectedNote, filteredNotes, fetchNotes]);

  const confirmDelete = useCallback((noteId: string) => {
    setNoteToDeleteId(noteId);
    setShowDeleteModal(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setNoteToDeleteId(null);
  }, []);

  const executeDelete = useCallback(async () => {
    if (noteToDeleteId) {
      await handleDelete(noteToDeleteId);
      setShowDeleteModal(false);
      setNoteToDeleteId(null);
    }
  }, [noteToDeleteId, handleDelete]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Add this function before the component
  const stripMarkdown = (content: string) => {
    return content
      .replace(/[#*_~`]/g, '') // Remove markdown special characters
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to just text
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();
  };

  return (
    <AppLayout>
      {/* Desktop View */}
      <div className="hidden sm:flex h-[calc(100vh-64px)]">
        {/* Notes List Sidebar */}
        <div 
          className={`relative flex flex-col border-r border-gray-200 dark:border-gray-700 
            ${isNoteListCollapsed ? 'w-16' : 'w-64 sm:w-72 md:w-80'} 
            transition-all duration-300`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsNoteListCollapsed(!isNoteListCollapsed)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-sm"
          >
            {isNoteListCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              {!isNoteListCollapsed && <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>}
              <button
                onClick={handleNewNote}
                className="p-1.5 sm:p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            {!isNoteListCollapsed && (
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
            )}
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No notes match your search.' : 'No notes yet. Create one!'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNoteSelect(note)}
                    className={`p-3 sm:p-4 cursor-pointer transition-colors ${
                      selectedNote?.id === note.id
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {isNoteListCollapsed ? (
                      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <FileText size={16} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-1 truncate">
                          {note.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {stripMarkdown(note.content)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => {
                    const updatedNote = { ...selectedNote, title: e.target.value };
                    setSelectedNote(updatedNote);
                    handleSave(updatedNote);
                  }}
                  className="w-full text-lg sm:text-xl font-semibold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500"
                  placeholder="Untitled Note"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <NoteEditor
                  note={selectedNote}
                  onSave={handleSave}
                  showPreview={showPreview}
                  onTogglePreview={() => setShowPreview(!showPreview)}
                  onDelete={() => confirmDelete(selectedNote.id)}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p className="text-center px-4">
                Select a note or create a new one to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden h-[calc(100vh-64px)]">
        {mobileEditorOpen ? (
          // Note Editor View
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToList}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <input
                  type="text"
                  value={selectedNote?.title || ''}
                  onChange={(e) => {
                    if (selectedNote) {
                      const updatedNote = { ...selectedNote, title: e.target.value };
                      setSelectedNote(updatedNote);
                      handleSave(updatedNote);
                    }
                  }}
                  className="w-full text-lg font-semibold bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500"
                  placeholder="Untitled Note"
                />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {selectedNote && (
                <NoteEditor
                  note={selectedNote}
                  onSave={handleSave}
                  showPreview={showPreview}
                  onTogglePreview={() => setShowPreview(!showPreview)}
                  onDelete={() => confirmDelete(selectedNote.id)}
                />
              )}
            </div>
          </div>
        ) : (
          // Notes List View
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h2>
                <button
                  onClick={handleNewNote}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No notes match your search.' : 'No notes yet. Create one!'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleNoteSelect(note)}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    >
                      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1 truncate">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {stripMarkdown(note.content)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Note
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}