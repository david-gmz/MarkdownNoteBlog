import { SidebarProps } from "../../models";
import classes from './Sidebar.module.css'

export default function Sidebar({
    notes,
    currentNote,
    setCurrentNoteId,
    newNote,
    deleteNote
}: SidebarProps) {
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
                    <h4 className={classes["text-snippet"]}>
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
                    className={`${classes["sidebar__header--heading"]}`}>
                    Notes
                </h3>
                <button className={classes["new-note"]} onClick={newNote}>
                    +
                </button>
            </div>
            {noteElements}
        </section>
    );
}
