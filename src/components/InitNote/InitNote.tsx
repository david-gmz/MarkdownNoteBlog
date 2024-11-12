import React from "react";
import classes from "./InitNote.module.css";
import { NoteContext } from "../../store/notesContext";
import { NewNoteProps } from "../../models";

export default function InitNote() {
    const { createNewNote, darkMode }: NewNoteProps = React.useContext(NoteContext);
    const mode = `${classes["no-notes"]} ${darkMode ? classes["dark"] : ""}`;
    return (
        <div className={mode}>
            <h1>You have no notes</h1>
            <button
                className={classes["first-note"]}
                onClick={() => createNewNote()}>
                Create one now
            </button>
        </div>
    );
}
