interface Note {
    id: string;
    body: string;
}
interface EditorProps {
    currentNote: Note;
    updateNote: (text: string) => void;
}

interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    newNote: () => void;
    deleteNote: (
        id: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) => void;
}

type NavbarProps = {
    darkMode: boolean;
    toggleTheme: () => void;
};

export type { Note, EditorProps, SidebarProps, NavbarProps };
