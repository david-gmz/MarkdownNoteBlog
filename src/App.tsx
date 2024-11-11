import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { nanoid } from "nanoid";
import Split from "@uiw/react-split";
import type { Note } from "./models";
import "./App.css";
import InitNote from "./components/InitNote";
import Navbar from "./components/Navbar";

export default function App() {
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

    return (
        <>
            <Navbar darkMode={darkMode} toggleTheme={handleToggle} />
            <main>
                {notes.length > 0 ? (
                    <Split
                        style={{
                            height: "100%",
                            border: "1px solid #d5d5d5",
                            borderRadius: 3
                        }}>
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {currentNoteId && notes.length > 0 && (
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        )}
                    </Split>
                ) : (
                    <InitNote createNewNote={createNewNote} />
                )}
            </main>
        </>
    );
}
