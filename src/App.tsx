import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "@uiw/react-split";
import "./App.css";
import { NotesContextProvider } from "./store/notesContext";
import Container from "./components/Container";

export default function App() {
    return (
        <NotesContextProvider>
            <Container>
                <Split
                    style={{
                        height: "100%",
                        border: "1px solid #d5d5d5",
                        borderRadius: 3
                    }}>
                    <Sidebar />
                    <Editor />
                </Split>
            </Container>
        </NotesContextProvider>
    );
}
