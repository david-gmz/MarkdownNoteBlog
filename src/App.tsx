import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import "./App.css";
import { NoteContextProvider } from "./store/note-context";
import Container from "./components/Container";

export default function App() {
    return (
        <NoteContextProvider>
            <Container>
                <Sidebar />
                <Editor />
            </Container>
        </NoteContextProvider>
    );
}
