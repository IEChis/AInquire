import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Note } from '../types'

interface NoteState {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Note
  removeNote: (id: string) => void
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (note) => {
        const full: Note = {
          ...note,
          id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        }
        set({ notes: [full, ...get().notes] })
        return full
      },
      removeNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
    }),
    { name: 'ai-ask-book-notes-v2' },
  ),
)
