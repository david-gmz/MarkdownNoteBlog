import Toggler from "./Toggler";
import logo from "../../assets/react.svg";
import classes from "./Navbar.module.css";
import { ThemeMode } from "../../models";

export default function Navbar({darkMode, toggleDarkMode}: ThemeMode) {
    return (
        <nav className={`${classes["nav"]} ${darkMode ? "dark" : ""}`}>
            <img className={classes["nav--logo_icon"]} src={logo} />
            <h3 className={classes["nav--logo_text"]}>React Markdown Editor</h3>
            <Toggler darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </nav>
    );
}