import React from "react";
import { NavbarProps } from "../../../models";
import classes from "./Toggler.module.css"
import { NoteContext } from "../../../store/notesContext";

export default function Toggler() {
    const { darkMode, toggleTheme }: NavbarProps = React.useContext(NoteContext)
    const schemeMode = darkMode ? classes["dark"] : "";
    return (
        <div className={`${schemeMode} ${classes["toggler"]}`}>
            <p className={classes["toggler--light"]}>Light</p>
            <div className={classes["toggler--slider"]} onClick={toggleTheme}>
                <div className={classes["toggler--slider--circle"]}></div>
            </div>
            <p className={classes["toggler--dark"]}>Dark</p>
        </div>
    );
}