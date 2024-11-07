import Toggler from "./Toggler";
import logo from "../../assets/react.svg";
import classes from "./Navbar.module.css";
import { useContext } from "react";
import { NoteContext } from "../../store/note-context";

export default function Navbar() {
    const { darkMode } = useContext(NoteContext);
    return (
        <nav className={`${classes["nav"]} ${darkMode ? "dark" : ""}`}>
            <img className={classes["nav--logo_icon"]} src={logo} />
            <h3 className={classes["nav--logo_text"]}>React Markdown Editor</h3>
            <Toggler />
        </nav>
    );
}