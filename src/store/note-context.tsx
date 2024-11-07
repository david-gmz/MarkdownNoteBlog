import { createContext, useState, useEffect } from "react";
import { ChildrenType, Note, TypeNoteContext } from "../models";
import { firestore, notesCollection } from "../lib";
import { addDoc, deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";

const NoteContext = createContext<TypeNoteContext>({
    notes: [],
    currentNote: {
        id: "",
        body: "",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    setCurrentNoteId: () => {},
    addNote: () => {},
    deleteNote: () => {},
    darkMode: false,
    toggleDarkMode: () => {},
    tempNoteText: "",
    setTempNoteText: () => {}
});

function NoteContextProvider({ children }: ChildrenType) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [tempNoteText, setTempNoteText] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const handleToggleThemeMode = () => setDarkMode(prevMode => !prevMode);
    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => +b.updatedAt - +a.updatedAt);
    useEffect(() => {
        if (currentNote && currentNote.body !== undefined)
            setTempNoteText(currentNote.body);
    }, [currentNote]);
    useEffect(
        () =>
            onSnapshot(notesCollection, snapshot =>
                setNotes(
                    snapshot.docs.map(doc => ({
                        ...(doc.data() as Note),
                        id: doc.id
                    }))
                )
            ),
        []
    );
    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [currentNoteId, notes]);
    const addNote = async () => {
        const newNoteRef = await addDoc(notesCollection, {
            body: "**Type your markdown note's title here**",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        setCurrentNoteId(newNoteRef.id);
    };

    const deleteNote = async (noteId: string) => {
        const docRef = doc(firestore, "notes", noteId);
        try {
            await deleteDoc(docRef);
        } catch (error) {
            console.log(`I got an error ${error}`);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Ensure currentNote is defined and has a body
            if (currentNote && tempNoteText !== currentNote.body) {
                const updateNote = async (text: string) => {
                    const docRef = doc(firestore, "notes", currentNoteId);
                    await setDoc(
                        docRef,
                        { body: text, updatedAt: Date.now() },
                        { merge: true }
                    );
                };
                updateNote(tempNoteText);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [currentNote, tempNoteText, currentNoteId, currentNote?.body]); // Add optional chaining

    const ctxNotes = {
        notes: sortedNotes,
        currentNote,
        setCurrentNoteId,
        addNote,
        deleteNote,
        darkMode,
        toggleDarkMode: handleToggleThemeMode,
        tempNoteText,
        setTempNoteText
    };
    return (
        <NoteContext.Provider value={ctxNotes}>{children}</NoteContext.Provider>
    );
}

export { NoteContext, NoteContextProvider };
