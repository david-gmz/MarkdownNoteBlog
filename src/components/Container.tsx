import Split from "@uiw/react-split";
import Navbar from "./Navbar";
import InitNote from "./InitNote";
import { ChildrenType } from "../models";
import { useContext } from "react";
import { NoteContext } from "../store/note-context";

export default function Container({ children }: ChildrenType) {
    const { notes, darkMode } = useContext(NoteContext);
    return (
        <>
            <Navbar />
            <main className={darkMode ? "dark" : ""}>
                {notes.length > 0 ? (
                    <Split
                        style={{
                            height: "100%",
                            border: "1px solid #d5d5d5",
                            borderRadius: 3
                        }}>
                        {children}
                    </Split>
                ) : (
                    <InitNote />
                )}
            </main>
        </>
    );
}
