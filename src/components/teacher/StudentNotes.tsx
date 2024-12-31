'use client';

import { FC, useState } from 'react';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  content: string;
  date: string;
  type: 'note' | 'objective';
  status?: 'pending' | 'completed';
}

interface StudentNotesProps {
  studentId: string;
}

export const StudentNotes: FC<StudentNotesProps> = ({ studentId }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Améliorer la compréhension des textes narratifs',
      date: '2024-01-15',
      type: 'objective',
      status: 'pending'
    },
    {
      id: '2',
      content: 'Montre un grand intérêt pour les histoires d\'aventure',
      date: '2024-01-10',
      type: 'note'
    }
  ]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'objective'>('note');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      date: new Date().toISOString().split('T')[0],
      type: noteType,
      status: noteType === 'objective' ? 'pending' : undefined
    };

    setNotes([note, ...notes]);
    setNewNote('');
    toast.success(noteType === 'note' ? 'Note ajoutée' : 'Objectif ajouté');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success('Supprimé');
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: editContent } : note
    ));
    setEditingId(null);
    toast.success('Modifications enregistrées');
  };

  const toggleObjectiveStatus = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? {
        ...note,
        status: note.status === 'pending' ? 'completed' : 'pending'
      } : note
    ));
    toast.success('Statut mis à jour');
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setNoteType('note')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              noteType === 'note' 
                ? 'bg-white/20' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Note
          </button>
          <button
            onClick={() => setNoteType('objective')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              noteType === 'objective' 
                ? 'bg-white/20' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Objectif
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={noteType === 'note' ? "Ajouter une note..." : "Définir un objectif..."}
            className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            onClick={addNote}
            disabled={!newNote.trim()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Liste des notes et objectifs */}
      <div className="space-y-4">
        {notes.map(note => (
          <div
            key={note.id}
            className={`bg-white/5 rounded-lg p-4 ${
              note.type === 'objective' && note.status === 'completed'
                ? 'opacity-75'
                : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editingId === note.id ? (
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white/10 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                ) : (
                  <div className={`${
                    note.type === 'objective' && note.status === 'completed'
                      ? 'line-through'
                      : ''
                  }`}>
                    {note.content}
                  </div>
                )}
                <div className="text-sm text-white/50 mt-1">
                  {new Date(note.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {note.type === 'objective' && (
                  <button
                    onClick={() => toggleObjectiveStatus(note.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.status === 'completed'
                        ? 'bg-green-500/20 hover:bg-green-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                )}
                {editingId === note.id ? (
                  <button
                    onClick={() => saveEdit(note.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(note)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
