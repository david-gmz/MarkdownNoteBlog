import { createContext, useEffect, useReducer } from "react";
import { ChildrenType, Note, TypeNoteContext } from "../models";
import { firestore, notesCollection } from "../lib";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { initialState, notesReducer, ActionType } from "./notesReducer";

const NoteContext = createContext<TypeNoteContext>({
    notes: [],
    currentNote: {
        id: "",
        body: "",
        createdAt: Date.now(),
        updatedAt: Date.now()
    },
    currentNoteId: "",
    setCurrentNoteId: () => {},
    addNote: () => {},
    deleteNote: () => {},
    darkMode: false,
    toggleDarkMode: () => {},
    tempNoteText: "",
    setTempNoteText: () => {}
});

function NoteContextProvider({ children }: ChildrenType) {
    const [state, dispatch] = useReducer(notesReducer, initialState);
    const currentNote =
        state.notes.find(note => note.id === state.currentNoteId) ||
        state.notes[0];
    const sortedNotes = state.notes.sort((a, b) => +b.updatedAt - +a.updatedAt);
    const setCurrentNoteId = (id: string) => {
        const newCurrentNoteId =
            state.notes.find(note => note.id === id) || state.notes[0].id;
        dispatch({
            type: ActionType.SET_CURRENT_NOTE_ID,
            payload: newCurrentNoteId
        });
    };

    const setTempNoteText = (text: string) =>
        dispatch({ type: ActionType.UPDATE_TEMP_TEXT, payload: text });

    useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, snapshot => {
            dispatch({
                type: ActionType.SET_NOTES,
                payload: snapshot.docs.map(doc => ({
                    ...(doc.data() as Note),
                    id: doc.id
                }))
            });
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!state.currentNoteId) {
            dispatch({
                type: ActionType.SET_CURRENT_NOTE_ID,
                payload: state.notes[0]?.id
            });
        }
    }, [state.currentNoteId, state.notes]);

    const addNote = async () => {
        const newNoteRef = await addDoc(notesCollection, {
            body: "**Type your markdown note's title here**",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        dispatch({
            type: ActionType.SET_CURRENT_NOTE_ID,
            payload: newNoteRef.id
        });
    };
    const deleteNote = async (noteId: string) => {
        const docRef = doc(firestore, "notes", noteId);
        try {
            await deleteDoc(docRef);
        } catch (error) {
            console.log(`I got an error ${error}`);
        }
    };
    const handleToggleThemeMode = () =>
        dispatch({ type: ActionType.TOGGLE_DARK_MODE });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentNote && state.tempNoteText !== currentNote?.body) {
                const updateNote = async (text: string) => {
                    const docRef = doc(firestore, "notes", state.currentNoteId);
                    await setDoc(
                        docRef,
                        { body: text, updatedAt: Date.now() },
                        { merge: true }
                    );
                    dispatch({
                        type: ActionType.UPDATE_NOTE,
                        payload: { body: text, updatedAt: Date.now() }
                    });
                };
                updateNote(state.tempNoteText);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [currentNote, state.tempNoteText, state.currentNoteId]);

    useEffect(() => {
        const currentNote = state.notes.find(
            note => note.id === state.currentNoteId
        );
        if (currentNote && currentNote.body !== state.tempNoteText) {
            dispatch({
                type: ActionType.UPDATE_TEMP_TEXT,
                payload: { text: currentNote.body }
            });
        }
    }, [state.currentNoteId, state.notes, state.tempNoteText]);

    const ctxNotes = {
        ...state,
        notes: sortedNotes,
        currentNote,
        setCurrentNoteId,
        addNote,
        deleteNote,
        toggleDarkMode: handleToggleThemeMode,
        setTempNoteText
    };

    return (
        <NoteContext.Provider value={ctxNotes}>{children}</NoteContext.Provider>
    );
}

export { NoteContext, NoteContextProvider };
