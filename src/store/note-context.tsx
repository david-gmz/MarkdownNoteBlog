import { createContext } from "react";

const NoteContext = createContext({
    notes: []
});

export { NoteContext };