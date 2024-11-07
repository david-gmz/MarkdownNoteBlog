import { useContext } from "react";
import { NoteContext } from "../../store/note-context";
import classes from "./InitNote.module.css";

export default function InitNote() {
    const { addNote, darkMode } = useContext(NoteContext);
    const mode = `${classes["no-notes"]} ${darkMode ? classes["dark"] : ""}`;
    return (
        <div className={mode}>
            <h1>You have no notes</h1>
            <button className={classes["first-note"]} onClick={() => addNote()}>
                Create one now
            </button>
        </div>
    );
}
