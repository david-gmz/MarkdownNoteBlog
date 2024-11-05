import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    setDoc
} from "firebase/firestore";
import { app } from "./firebase";

const firestore = getFirestore(app);

const notesCollection = collection(firestore, "notes");

const addNote = async (body: "**Type your markdown note's title here**") => {
    try {
        const newNote = await addDoc(notesCollection, { body });
        console.log(`The new note was created at ${newNote.path}`);
    } catch (error) {
        console.log(`I got an error ${error}`);
    }
};

const deleteNote = async (noteId: string) => {
    const docRef = doc(firestore, "notes", noteId);
    try {
        await deleteDoc(docRef);
    } catch (error) {
        console.log(`I got an error ${error}`);
    }
};

const updateNote = async (currentNoteId: string, body: string) => {
    const docRef = doc(firestore, "notes", currentNoteId);
    setDoc(docRef, { body }, { merge: true });
};

export { firestore, notesCollection, addNote, deleteNote, updateNote };
