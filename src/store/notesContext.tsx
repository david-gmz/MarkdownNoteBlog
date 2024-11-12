import React from "react";
import { nanoid } from "nanoid";
import { ChildrenProp, NotesContextProps, Note } from "../models";

const NoteContext = React.createContext<NotesContextProps>({
    notes: [],
    currentNote: { id: "", body: "" },
    currentNoteId:"",
    setCurrentNoteId: () => {},
    createNewNote: () => {},
    deleteNote: () => {},
    updateNote: () => {},
    darkMode: false,
    toggleTheme: () => {}
});

function NotesContextProvider({ children }: ChildrenProp) {
    const [darkMode, setDarkMode] = React.useState(false);
    const handleToggle = () => setDarkMode(prevDark => !prevDark);
    const notesStorage = localStorage.getItem("notes");
    const initialNotes: Note[] = notesStorage ? JSON.parse(notesStorage) : [];

    const [notes, setNotes] = React.useState<Note[]>(() => initialNotes);

    const [currentNoteId, setCurrentNoteId] = React.useState(
        notes[0]?.id || ""
    );
    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0];

    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    function createNewNote() {
        const newNote: Note = {
            id: nanoid(),
            body: "**Type your markdown note's title here!**"
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text: string) {
        setNotes(oldNotes => {
            const updatedNotes = [];
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i];
                if (oldNote.id === currentNoteId) {
                    updatedNotes.unshift({ ...oldNote, body: text });
                } else {
                    updatedNotes.push(oldNote);
                }
            }
            return updatedNotes;
        });
    }

    function deleteNote(
        noteId: string,
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        event.stopPropagation();
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
    const notesCtx = {
        notes,
        currentNote,
        currentNoteId,
        setCurrentNoteId,
        createNewNote,
        deleteNote,
        updateNote,
        darkMode,
        toggleTheme: handleToggle
    };
    return (
        <NoteContext.Provider value={notesCtx}>{children}</NoteContext.Provider>
    );
}

export { NoteContext, NotesContextProvider };
