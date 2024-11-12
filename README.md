# Learning TypeScript into ReactJS 18 <br> (A TypeScript journey Part I)
**Based on [Learn React Course on Scrimba](https://v2.scrimba.com/learn-react-c0e)[^1]** <br> *by [Bob Ziroll](https://v2.scrimba.com/@bobziroll:courses)*

---

Trying to grasp TypeScript in React... strugling at the moment!
### Intro
This is an excersice to practice what I learned in a basic course on TypeScript also in scrimba now applyed usccesfully in small React project found in an excellent course I found in scrimba too, actually after finished TypeScript course I read that Bob has also a course on React. Though I already knew React I've been working on JS only. 
So the project started reading and writing in the editor and managing the data in `localStorage`, then move data to firebase[^2].

---
<details>
<summary>Starting React Project with only JS</summary>

```js
//@see ./App.tsx
export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}

//@see ./components/Editor.tsx
export default function Editor({ currentNote, updateNote }) {
    return (
        <section className="pane editor">
            <MDEditor
                minHeight={80}
                value={currentNote.body}
                onChange={updateNote}
            />
        </section>
    );
}
//@see ./components/Sidebar.tsx
export default function Sidebar(props) {
    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div
                
                className={`title ${
                    note.id === props.currentNote.id ? "selected-note" : ""
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                <h4 className="text-snippet">Note {index + 1}</h4>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}
```
</details>


<details>
<summary>First attempt to migrate the React App to TS</summary>

## First failed

>### Chating with the AI: 
> *I'm going to skip the first code for brevity porpus.*
>
>>**Me** - Since I'm learning I'm going to explain what I did first and get a similar result on what you did but would like your opinion. I started defining my types from the components to the App. You did it from the App to the components, I must admit that your methodology it's clearer because it also the logic on going down when managing states variables, what do you think? 
However we got the same type error on the onChange property of the MDEditor component in `Editor.tsx` as follow:

```ts
Type '(text: string) => void' is not assignable to type '(value?: string | undefined, event?: ChangeEvent<HTMLTextAreaElement> | undefined, state?: ContextStore | undefined) => void'.
  Types of parameters 'text' and 'value' are incompatible.
    Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.ts(2322)
Types.d.ts(24, 5): The expected type comes from property 'onChange' which is declared here on type 'IntrinsicAttributes & MDEditorProps & RefAttributes<RefMDEditor>'
```
Trying to fix this is when I got a mess. How could we fix it?

## Solution
>### AI Response
>> **AI** - Let's break down the types for each component in your app and define them one at a time. TypeScript can be tricky initially, but defining the structure for each prop and state value should make it clearer.

#### Step 1: Define Note Type
*Since you’re working with notes that have an id and body, let's start by creating a `Note type` to represent each note’s structure:*
```ts
// @see ./modals/types.ts -> has moved to index.ts
export interface Note {
    id: string;
    body: string;
}
```

#### Step 2: Update App Component Types
*Let's update the App component. We’ll need to set types for:*

- `Notes (array of Note type)`
- ` currentNoteId (string)`
- `createNewNote and updateNote functions.`

*Update your imports and state declarations with these types:*

```ts
export default function App() {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = React.useState<string>(
        (notes[0] && notes[0].id) || ""
    );
    function createNewNote() {
        const newNote: Note = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text: string) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote;
        }));
    }function createNewNote() {
        const newNote: Note = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text: string) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote;
        }));
    }
    // more code goes here

```
#### Step 3: Update Editor Component Types
*In Editor, currentNote is of type Note, and updateNote is a function that accepts a string:*

```ts
//@see ./components/Editor.tsx
import { Note } from './types';

interface EditorProps {
    currentNote: Note;
    updateNote: (text: string) => void;
}

export default function Editor({ currentNote, updateNote }: EditorProps) {
```

#### Step 4: Update Sidebar Component Types
*In Sidebar, we’ll define the props types for notes, currentNote, setCurrentNoteId, and newNote.*

```ts
interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    newNote: () => void;
}

export default function Sidebar({ notes, currentNote, setCurrentNoteId, newNote }: SidebarProps) {
    const noteElements = notes.map((note, index) => ( // more code here -->
```
#### Step 5: Verify and Test
*After these updates, the app should align well with TypeScript, and each component’s props should be type-safe. Let me know if you need help with additional tweaks!*

**Me**
Since I'm learning I'm going to explain what I did first and get a similar result on what you did but would like your opinion. I started defining my types from the components to the App, I must admit that your methodology it's clearer because it also the logic on going down when managing states variables what do you think. 
However we got the same type error on the onChange property of the MDEditor component in the Editor.tsx as follow:

```ts
Type '(text: string) => void' is not assignable to type '(value?: string | undefined, event?: ChangeEvent<HTMLTextAreaElement> | undefined, state?: ContextStore | undefined) => void'.
  Types of parameters 'text' and 'value' are incompatible.
    Type 'string | undefined' is not assignable to type 'string'.
      Type 'undefined' is not assignable to type 'string'.ts(2322)
Types.d.ts(24, 5): The expected type comes from property 'onChange' which is declared here on type 'IntrinsicAttributes & MDEditorProps & RefAttributes<RefMDEditor>'
```

**AI**
It sounds like you’re close! The issue with the onChange prop is due to MDEditor expecting a more complex function signature. Here, it’s expecting a function that takes value (potentially undefined) along with optional parameters like event and state.

## To resolve this:

We can adjust the `onChange` function to handle the `undefined` case for `value` explicitly.
Instead of using `updateNote` directly, wrap it in a function that aligns with the expected MDEditor signature.
Here’s how to modify Editor.tsx:

```ts
// Editor.tsx
import React from 'react';
import { Note } from './types';

interface EditorProps {
    currentNote: Note;
    updateNote: (text: string) => void;
}

export default function Editor({ currentNote, updateNote }: EditorProps) {
    function handleEditorChange(value?: string) {
        // Ensure we only pass a defined string to updateNote
        if (value !== undefined) {
            updateNote(value);
        }
    }

    return (
        <section className="pane editor">
            <MDEditor
                minHeight={80}
                value={currentNote.body}
                onChange={handleEditorChange}
            />
        </section>
    );
}
```
## Explanation
`handleEditorChange` now accepts value?: string, which matches the type expected by `MDEditor`.
It checks if value is defined, and if so, calls updateNote.
This keeps updateNote as `(text: string) => void`, maintaining the simplicity in App.tsx.
This approach keeps updateNote focused on handling only defined strings and avoids adding complexity to the main app’s logic.

**Me** This clears it up! So we didn't need to specify the `event?: React.ChangeEvent<HTMLTextAreaElement>` property in the `MDEditorProps.onChange` since its optional?
xactly! Since event is optional in MDEditorProps.onChange, we can skip it if we don’t need it in our handler.

By only using the value parameter, TypeScript won’t expect you to handle the event or other optional arguments (event and state) unless you need them. This is helpful because it keeps your handleEditorChange function lean and focused on updating the note’s text, without extra complexity.

In cases where you do need to work with event or state, you can add them to the function signature as needed:

```ts
function handleEditorChange(value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>) {
    if (value !== undefined) {
        updateNote(value);
    }
    // You could use `event` here if needed.
}
```
So yes, leaving out optional parameters in TypeScript is perfectly fine unless they're needed!

**Me**
It works! Now I can continue developing in this app using TS, sure I'm going to come up with more doubts
</details>

<details>
<summary>localStorage fail validation</summary>

## Second fail: string | null contradiction 
>### Chating with the AI: 
> *I'm going to skip the first code for brevity porpus.*
>
>>**Me**
I added this snnipet to be able to localStorage the text notes in the App like:

```ts
//App.tsx
    const notesStorage: string = localStorage.getItem('notes');
   
    const [notes, setNotes] = React.useState<Note[]>(
        JSON.parse(notesStorage) || []
    );
    
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    );
    useEffect(() => {
     localStorage.setItem('notes', JSON.stringify(notes))
    }, [notes])
```
But the `noteStorage` is complaining 
```ts
Type 'string | null' is not assignable to type 'string'.
  Type 'null' is not assignable to type 'string'.ts(2322)
```
So  if I declare `const notesStorage: string | null = localStorage.getItem('notes');` then in `notesStorage` in the expresion:

```ts
const [notes, setNotes] = React.useState<Note[]>(
        JSON.parse(notesStorage) || []
    );

```
I got the error type

```ts
Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.ts(2345)
```
So then how to set the type correctly?
## Solution: check for null before attempting to parse it
### AI Response
To handle localStorage.getItem('notes'), which returns string | null in TypeScript, we need to check for null before attempting to parse it. Here’s a revised approach to safely parse notesStorage only if it’s not null.

```ts
// App.tsx
import React, { useEffect } from 'react';

const notesStorage = localStorage.getItem('notes');

const initialNotes: Note[] = notesStorage ? JSON.parse(notesStorage) : [];

const [notes, setNotes] = React.useState<Note[]>(initialNotes);
const [currentNoteId, setCurrentNoteId] = React.useState<string>(
    (initialNotes[0] && initialNotes[0].id) || ""
);

useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
}, [notes]);
```
### Explanation
Initialize Safely: By using a conditional notesStorage ? JSON.parse(notesStorage) : [], we ensure JSON.parse is only called when notesStorage is a non-null string.
Type-Safe Initial State: Assign initialNotes as the default value for notes when initializing state. This way, notes starts with an empty array if there’s nothing in localStorage.
This approach avoids null issues while keeping notes type-safe as Note[].

### Explanation for the `useEffect`
In this case, using `useEffect` is essential for ensuring that localStorage updates each time notes changes, making it a controlled side effect. Here’s why it's beneficial:

**Keeps State and localStorage in Sync:** By updating localStorage inside `useEffect`, you ensure that every time notes changes, localStorage reflects the latest state. Without `useEffect`, updating localStorage would require adding localStorage.setItem to every part of your code that modifies notes, which can lead to errors or missed updates.

**Avoids Re-renders and Potential Bugs:** Directly calling localStorage.setItem outside `useEffect` in a function body could cause unnecessary re-renders, especially if setNotes is called multiple times within a single render cycle. With `useEffect`, the update to localStorage is isolated to run only after notes has fully updated, which prevents re-render loops.

**Future Maintenance:** It’s a best practice to put code with side effects (like localStorage interactions) into `useEffect`, as it signals intent and keeps your component’s primary logic (like rendering or handling user actions) clean and focused. This structure makes it easier to maintain and refactor later.

So, while it might work without `useEffect`, using it ensures consistent, reliable updates to localStorage and keeps your code easier to understand and maintain.
</details>

<details><summary>Event Definition Type</summary>
 
## Delete Note
### event: Event | undefined

```ts
interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    newNote: () => void;
    deleteNote: (id: string, event: Event | undefined) => void;
}
```

And adding this function to delete notes
```ts
//App.tsx
function deleteNote(noteId, event) {
        event.stopPropagation();
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
    //more code ...

    <Sidebar
      notes={notes}
      currentNote={findCurrentNote()}
      setCurrentNoteId={setCurrentNoteId}
      newNote={createNewNote}
      deleteNote={deleteNote}
    />

// Sidebar.tsx I added a delete button

    <div key={note.id}>
        <div
            className={`title ${
                note.id === currentNote.id ? "selected-note" : ""
            }`}
            onClick={() => setCurrentNoteId(note.id)}>
            <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
            <button
                className="delete-btn"
                onClick={() => deleteNote(note.id, event)}>
                <i className="gg-trash trash-icon"></i>
            </button>
        </div>
    </div>
```

Type Error:

## Solution
The issue here is that TypeScript doesn’t know the type of event in the deleteNote function. Since the event comes from a button’s onClick, we can explicitly type it as `React.MouseEvent<HTMLButtonElement>`.

Here's how to update your code:

### Step 1: Update the deleteNote Function in App.tsx
Type the noteId as string and event as `React.MouseEvent<HTMLButtonElement>`. This will clarify that deleteNote expects a click event from a button:

```ts
// App.tsx
import React from 'react';

function deleteNote(noteId: string, event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
}
```
### Step 2: Update the Delete Button in Sidebar.tsx
In Sidebar, we’ll also ensure deleteNote is called with the correct event. Instead of `() => deleteNote(note.id, event)`, pass the `event` directly by modifying onClick to capture the event parameter:

```ts
<button
    className="delete-btn"
    onClick={(event) => deleteNote(note.id, event)}>
    <i className="gg-trash trash-icon"></i>
</button>
```
### Full Updated Sidebar.tsx Snippet
The component now directly passes the event to deleteNote:

```ts
interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    newNote: () => void;
    deleteNote: (noteId: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Sidebar({ notes, currentNote, setCurrentNoteId, newNote, deleteNote }: SidebarProps) {
    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={newNote}>+</button>
            </div>
            {notes.map((note) => (
                <div key={note.id}>
                    <div
                        className={`title ${note.id === currentNote.id ? "selected-note" : ""}`}
                        onClick={() => setCurrentNoteId(note.id)}>
                        <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                        <button
                            className="delete-btn"
                            onClick={(event) => deleteNote(note.id, event)}>
                            <i className="gg-trash trash-icon"></i>
                        </button>
                    </div>
                </div>
            ))}
        </section>
    );
}
```
This ensures TypeScript understands the types, making your app both type-safe and functionally correct.

**Me** 
How could I skip this part to add the event parameter at calling the function on the click event!! `onClick={(event) => deleteNote(note.id, event)}>`.  And even with that little bug the delete button was working but now as you stated makes the app both type-safe and functionally correct. I see that with TypeScript I force myself to know what I'm doing when programming!

**AI**
Absolutely right—TypeScript can feel like a strict teacher, but it really helps to catch those little details that can easily slip by otherwise. By enforcing types, it encourages you to think through exactly how data flows through your app, which ultimately makes everything more predictable and robust. It’s helping you deepen your understanding!
</details>

<details open><summary>Refactoring with Context API</summary>
 
## createContext & useContext
### Avoiding Props Drilling
 One of the best ways to avoid Props drilling is by concentrating all your states properties in one place and the Context Api is one of the best choises for smalls apps like this one but with many properties.

</details>

---

[^1]: Thou the course is outdated based on React 17 with js, it's a very good excercise!
[^2]: This firbase is in the main git branch.