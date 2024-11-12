interface Note {
    id: string;
    body: string;
}
interface EditorProps {
    currentNote: Note;
    updateNote: (text: string) => void;
    darkMode: boolean;
}

interface NewNoteProps {
    createNewNote: () => void;
    darkMode: boolean;
}

interface ContainerProps {
    notes: Note[];
    currentNoteId: string;
    darkMode: boolean;
}
interface SidebarProps extends NewNoteProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    deleteNote: (
        id: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) => void;
}

type NavbarProps = {
    darkMode: boolean;
    toggleTheme: () => void;
};
type ChildrenProp = { children: React.ReactNode };
type NotesContextProps = EditorProps &
    SidebarProps &
    NavbarProps &
    ContainerProps;

export type {
    Note,
    EditorProps,
    NewNoteProps,
    SidebarProps,
    NavbarProps,
    ContainerProps,
    NotesContextProps,
    ChildrenProp
};
