import { Note, State } from "../models";
// actions and initial state
export enum ActionType {
    SET_NOTES = "SET_NOTES",
    SET_CURRENT_NOTE_ID = "SET_CURRENT_NOTE_ID",
    SET_TEMP_NOTE_TEXT = "SET_TEMP_NOTE_TEXT",
    TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE",
    ADD_NOTE = "ADD_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    UPDATE_NOTE = "UPDATE_NOTE",
    UPDATE_TEMP_TEXT = "UPDATE_TEMP_TEXT"
}

type Action =
    | { type: ActionType.SET_NOTES; payload: Note[] }
    | { type: ActionType.SET_CURRENT_NOTE_ID; payload: string }
    | { type: ActionType.SET_TEMP_NOTE_TEXT; payload: string }
    | { type: ActionType.TOGGLE_DARK_MODE }
    | { type: ActionType.ADD_NOTE; payload: Note }
    | { type: ActionType.DELETE_NOTE; payload: string }
    | { type: ActionType.UPDATE_NOTE; payload: Note }
    | { type: ActionType.UPDATE_TEMP_TEXT; payload: { text: string } };

const initialState: State = {
    notes: [],
    currentNoteId: "",
    tempNoteText: "",
    darkMode: false
};

function notesReducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.ADD_NOTE: {
            const newNote = {
                id: action.payload.id,
                body: "**Type your markdown note's title here**",
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            return {
                ...state,
                notes: [newNote, ...state.notes],
                currentNoteId: newNote.id
            };
        }

        case ActionType.DELETE_NOTE: {
            const filteredNotes = state.notes.filter(
                note => note.id !== action.payload
            );
            return {
                ...state,
                notes: filteredNotes,
                currentNoteId: filteredNotes[0]?.id || ""
            };
        }

        case ActionType.UPDATE_NOTE:
            return {
                ...state,
                notes: state.notes.map(note =>
                    note.id === action.payload.id
                        ? {
                              ...note,
                              body: action.payload.body,
                              updatedAt: Date.now()
                          }
                        : note
                )
            };

        case ActionType.SET_CURRENT_NOTE_ID:
            return {
                ...state,
                currentNoteId: action.payload,
                tempNoteText:
                    state.notes.find(note => note.id === action.payload)
                        ?.body || ""
            };

        case ActionType.UPDATE_TEMP_TEXT:
            return {
                ...state,
                tempNoteText: action.payload.text
            };

        default:
            return state;
    }
}

export { notesReducer, initialState };
