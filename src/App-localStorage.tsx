import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Editor from "./components/Editor/Editor";
import { nanoid } from "nanoid";
import Split from "@uiw/react-split";
import type { Note } from "./models";
import "./App.css";

export default function App() {
    const notesStorage = localStorage.getItem("notes");
    const initialNotes: Note[] = notesStorage ? JSON.parse(notesStorage) : [];

    const [notes, setNotes] = React.useState<Note[]>(() => initialNotes);

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) || ""
    );
    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0];

    useEffect(() => {
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
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}
