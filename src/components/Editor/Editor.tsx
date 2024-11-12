import React from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import rehypeSanitize from "rehype-sanitize";
import { EditorProps } from "../../models";
import { NoteContext } from "../../store/notesContext";

export default function Editor() {
    const { currentNote, updateNote, darkMode }: EditorProps =
        React.useContext(NoteContext);
    function handleEditorChange(value?: string) {
        if (value !== undefined) {
            updateNote(value);
        }
    }

    return (
        <section
            className="pane editor"
            data-color-mode={darkMode ? "dark" : "light"}>
            <MDEditor
                height="100%"
                value={currentNote.body}
                onChange={handleEditorChange}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]]
                }}
            />
        </section>
    );
}
