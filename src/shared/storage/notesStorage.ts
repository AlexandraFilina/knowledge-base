export interface INote {
  id: string;
  projectId: number;
  title: string;
  content: string;
  createdAt: string;
}

export const NOTES_KEY = "notes.v1";

export function loadNotes(): INote[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNotes(notes: INote[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function addNote(note: INote): void {
  const notes = loadNotes();
  notes.unshift(note);
  saveNotes(notes);
}

export function updateNote(noteId: string, content: string): void {
  const notes = loadNotes();
  const index = notes.findIndex((n) => n.id === noteId);
  if (index !== -1) {
    notes[index].content = content;
    saveNotes(notes);
  }
}

export function deleteNote(noteId: string): void {
  const notes = loadNotes();
  const filtered = notes.filter((n) => n.id !== noteId);
  saveNotes(filtered);
}

export function getProjectNotes(projectId: number): INote[] {
  const notes = loadNotes();
  return notes.filter((n) => n.projectId === projectId);
}
