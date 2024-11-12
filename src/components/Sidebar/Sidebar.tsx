import React from "react";
import { SidebarProps } from "../../models";
import { NoteContext } from "../../store/notesContext";
import classes from "./Sidebar.module.css";

export default function Sidebar() {
    const {
        notes,
        currentNote,
        setCurrentNoteId,
        createNewNote,
        deleteNote,
        darkMode
    }: SidebarProps = React.useContext(NoteContext);
    const mode = darkMode ? classes.dark : "";
    const noteElements = notes.map(note => {
        return (
            <div key={note.id}>
                <div
                    className={`${classes["title"]} ${
                        note.id === currentNote.id
                            ? classes["selected-note"]
                            : ""
                    }`}
                    onClick={() => setCurrentNoteId(note.id)}>
                    <h4 className={`${mode} ${classes["text-snippet"]}`}>
                        {note.body.split("\n")[0]}
                    </h4>
                    <button
                        className={classes["delete-btn"]}
                        onClick={event => deleteNote(note.id, event)}>
                        <i
                            className={`${classes["gg-trash"]} ${classes["trash-icon"]}`}></i>
                    </button>
                </div>
            </div>
        );
    });

    return (
        <section className={`pane ${classes["sidebar"]}`}>
            <div className={classes["sidebar__header"]}>
                <h3
                    className={`${mode} ${classes["sidebar__header--heading"]}`}>
                    Notes
                </h3>
                <button className={classes["new-note"]} onClick={createNewNote}>
                    +
                </button>
            </div>
            {noteElements}
        </section>
    );
}
