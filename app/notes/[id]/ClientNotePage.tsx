// app/notes/[id]/ClientNotePage.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import AppLayout from '../../../components/AppLayout';
import NoteEditor from '../../../components/NoteEditor';
import Modal from '../../../components/Modal';
import { Note } from '../../../types/note';
import { toast } from 'react-hot-toast';

type ClientNotePageProps = {
  id: string;
};

export default function ClientNotePage({ id }: ClientNotePageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState<Note>({
    id,
    title: '',
    content: '',
    user_id: user?.id || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Note);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isNew = id === 'new';

  const fetchNote = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setNote({
        ...data,
        updated_at: data.updated_at || data.created_at || new Date().toISOString(),
      } as Note);
    } catch (error) {
      console.error('Error fetching note:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!isNew) {
      fetchNote();
    } else {
      setNote((prev) => ({
        ...prev,
        updated_at: prev.updated_at || prev.created_at || new Date().toISOString(),
      } as Note));
      setLoading(false);
    }
  }, [isNew, fetchNote]);

  const handleSave = async (updatedNote: Note): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedNote.id);

      if (error) throw error;
      setNote({
        ...updatedNote,
        updated_at: new Date().toISOString()
      } as Note);
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      router.push('/');
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const confirmDelete = (id: string) => {
    // Implement the logic to confirm the deletion of the note
    console.log('Confirming deletion of note:', id);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <NoteEditor
            note={{
              id: note.id,
              title: note.title,
              content: note.content,
              created_at: note.created_at,
              updated_at: note.updated_at,
              user_id: note.user_id
            }}
            onSave={handleSave}
            showPreview={showPreview}
            onTogglePreview={() => setShowPreview(!showPreview)}
            onDelete={() => confirmDelete(note.id)}
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
  );
}