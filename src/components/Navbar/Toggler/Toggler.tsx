import { ThemeMode } from "../../../models";
import classes from "./Toggler.module.css"

export default function Toggler({ darkMode, toggleDarkMode }: ThemeMode) {
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