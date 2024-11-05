// import React from 'react';
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import rehypeSanitize from "rehype-sanitize";
import { EditorProps } from "../../models";

export default function Editor({ tempNoteText, setTempNoteText, darkMode }: EditorProps) {
    const handleChange = (text?: string) => {
        if (text !== undefined) setTempNoteText(text);
    };

    return (
        <section className="pane editor" data-color-mode={darkMode ? "dark" : "light"}>
            <MDEditor
                height="100%"
                value={tempNoteText}
                onChange={handleChange}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]]
                }}
            />
        </section>
    );
}
