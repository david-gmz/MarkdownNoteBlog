import { useContext } from "react";
import classes from "./Toggler.module.css"
import { NoteContext } from "../../../store/note-context";

export default function Toggler() {
     const { darkMode, toggleDarkMode } = useContext(NoteContext);
    const schemeMode = darkMode ? classes["dark"] : "";
    return (
        <div className={`${schemeMode} ${classes["toggler"]}`}>
            <p className={classes["toggler--light"]}>Light</p>
            <div
                className={classes["toggler--slider"]}
                onClick={toggleDarkMode}>
                <div className={classes["toggler--slider--circle"]}></div>
            </div>
            <p className={classes["toggler--dark"]}>Dark</p>
        </div>
    );
}