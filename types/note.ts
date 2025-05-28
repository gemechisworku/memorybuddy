export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type NewNote = Omit<Note, 'id' | 'created_at' | 'updated_at' | 'user_id'> 