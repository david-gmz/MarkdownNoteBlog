import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import type { Note } from "./models";
import "./App.css";
import { firestore, notesCollection } from "./lib";
import { addDoc, deleteDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import Split from "@uiw/react-split";
import Navbar from "./components/Navbar";

export default function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [tempNoteText, setTempNoteText] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const handleToggleThemeMode = () => setDarkMode(prevMode => !prevMode)
    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
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
    const themMode = darkMode ? "dark" : ""
    return (
        <>
            <Navbar
                darkMode={darkMode}
                toggleDarkMode={handleToggleThemeMode}
            />
            <main className={themMode}>
                {notes.length > 0 ? (
                    <Split
                        style={{
                            height: "100%",
                            border: "1px solid #d5d5d5",
                            borderRadius: 3
                        }}>
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            addNote={addNote}
                            deleteNote={deleteNote}
                            darkMode={darkMode}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                            darkMode={darkMode}
                        />
                    </Split>
                ) : (
                    <div className={`no-notes ${themMode}`}>
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={() => addNote()}>
                            Create one now
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}
