import { ReactNode } from "react";

interface Note {
    id: string;
    body: string;
    createdAt: number;
    updatedAt: number;
}

interface State {
  notes: Note[];
  currentNoteId: string;
  tempNoteText: string;
  darkMode: boolean;
}

interface TypeNoteContext extends State {
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    addNote: () => void;
    deleteNote: (id: string) => void;
    toggleDarkMode: () => void;
    setTempNoteText: (text: string) => void;
}

interface NoteProps {
    notes: Note[];
    currentNoteId: string;
    tempNoteText: string;
    darkMode: boolean;
}

// type TypeNoteContext = {
//     notes: Note[];
//     currentNote: Note;
//     setCurrentNoteId: (id: string) => void;
//     addNote: () => void;
//     deleteNote: (id: string) => void;
//     darkMode: boolean;
//     toggleDarkMode: () => void;
//     tempNoteText: string;
//     setTempNoteText: React.Dispatch<React.SetStateAction<string>>;
// }

type ChildrenType = {
    children: ReactNode;
}

export type { Note, TypeNoteContext, ChildrenType, NoteProps, State };
