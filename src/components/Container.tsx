import { ChildrenProp, ContainerProps } from "../models";
import Navbar from "./Navbar";
import InitNote from "./InitNote";
import React from "react";
import { NoteContext } from "../store/notesContext";

export default function Container({ children }: ChildrenProp) {
    const { notes, currentNoteId, darkMode }: ContainerProps = React.useContext(NoteContext);
    return (
        <>
            <Navbar />
            <main className={darkMode ? "dark" : ""}>
                {currentNoteId && notes.length > 0 && <>{children}</>}

                {notes.length === 0 && <InitNote />}
            </main>
        </>
    );
}
