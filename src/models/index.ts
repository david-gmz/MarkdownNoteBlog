interface Note {
    id: string;
    body: string;
    createdAt: number;
    updatedAt: number;
}
interface EditorProps {
    tempNoteText: string;
    setTempNoteText: React.Dispatch<React.SetStateAction<string>>;
    darkMode: boolean;
}

interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    addNote: () => void;
    deleteNote: (id: string) => void;
    darkMode: boolean;
}
interface DarkMode {
    darkMode: boolean;
}
interface ThemeMode extends DarkMode {
    toggleDarkMode: () => void;
}

export type { Note, EditorProps, SidebarProps, DarkMode, ThemeMode };
