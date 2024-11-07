import { ReactNode } from "react";

interface Note {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}

type TypeNoteContext = {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    addNote: () => void;
    deleteNote: (id: string) => void;
    darkMode: boolean;
    toggleDarkMode: () => void
    tempNoteText: string;
    setTempNoteText: React.Dispatch<React.SetStateAction<string>>;
};

type ChildrenType = {
    children: ReactNode;
}

export type { Note, TypeNoteContext, ChildrenType };
