import classes from "./InitNote.module.css";
type NewNoteProps = {
    createNewNote: () => void
}
export default function InitNote({ createNewNote }: NewNoteProps) {
    const mode = `${classes["no-notes"]}`;
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
