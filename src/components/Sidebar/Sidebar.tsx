import { SidebarProps } from "../../models";
import classes from "./Sidebar.module.css";

export default function Sidebar({
    notes,
    currentNote,
    setCurrentNoteId,
    addNote,
    deleteNote,
    darkMode
}: SidebarProps) {
    const mode = darkMode ? classes.dark : "";
    const noteElements = notes.map(note => {
        return (
            <div key={note.id}>
                <div
                    className={`${classes.title} ${
                        note.id === currentNote.id
                            ? classes["selected-note"]
                            : ""
                    }`}
                    onClick={() => setCurrentNoteId(note.id!)}>
                    <h4 className={`${mode} ${classes["text-snippet"]}`}>
                        {note.body?.split("\n")[0]}
                    </h4>
                    <button
                        className={classes["delete-btn"]}
                        onClick={() => deleteNote(note.id!)}>
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
                    className={`${mode} ${
                        classes["sidebar__header--heading"]
                    }`}>
                    Notes
                </h3>
                <button className={classes["new-note"]} onClick={addNote}>
                    +
                </button>
            </div>
            {noteElements}
        </section>
    );
}
