import {
    collection,
    getFirestore,
} from "firebase/firestore";
import { app } from "./firebase";

const firestore = getFirestore(app);

const notesCollection = collection(firestore, "notes");

export { firestore, notesCollection };
