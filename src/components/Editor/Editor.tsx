// import React from 'react';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import rehypeSanitize from "rehype-sanitize";
import { EditorProps } from "../../models";

export default function Editor({ currentNote, updateNote }: EditorProps) {
    function handleEditorChange(value?: string) {
    if (value !== undefined) {
        updateNote(value);
    }
}

    return (
        <section
            className="pane editor">
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
