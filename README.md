# Learning TypeScript into ReactJS 18 <br> (A TypeScript journey Part I)
 *Based on [Learn React Course on Scrimba](https://v2.scrimba.com/learn-react-c0e)[^1] <br> by [Bob Ziroll](https://v2.scrimba.com/@bobziroll:courses)*

---

Trying to grasp TypeScript in React... strugling at the moment!
## Intro - A failure branch with useReducer hook!
This is an excersice to practice what I learned in a basic course on TypeScript also in scrimba now applyed usccesfully in small React project found in an excellent course I found in scrimba too, actually after finished TypeScript course I read that Bob has also a course on React. Though I already knew React I've been working on JS only. 
So the project started reading and writing in the editor and managing the data in `localStorage`, then move data to firebase.

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

<details><summary>Type Error on switching to firebase </summary>
 
## firebase issues [^2]
### One Type Error
 Finally I finished my little App and I switch localStorage to firbade to store the text, everything is working except for two things, one is a type error and the other it's an issue of performance when I add a feature. But first I would like to takle the type error... let's see:
```ts
//I skiped all the import for brevety
//./models/index.ts
interface Note {
    id: string;
    body?: string;
    createdAt: number;
    updatedAt: number;
}
interface EditorProps {
    tempNoteText: string;
    setTempNoteText: React.Dispatch<React.SetStateAction<string>>;
}

interface SidebarProps {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    addNote: () => void;
    deleteNote: (id: string) => void;
}

export type { Note, EditorProps, SidebarProps };

// App.tsx
// Some imports here
export default function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [tempNoteText, setTempNoteText] = useState("");
    const currentNote =
        notes.find(note => note.id === currentNoteId) || notes[0];
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
    useEffect(() => {
        if (currentNote && currentNote.body !== undefined)
            setTempNoteText(currentNote.body);
    }, [currentNote]);
    useEffect(
        () =>
            onSnapshot(notesCollection, snapshot =>
                setNotes(
                    snapshot.docs.map(doc => ({  // here is the type error(1)
                        id: doc.id,
                        ...doc.data()
                    }))
                )
            ),
        []
    );
    useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [currentNoteId, notes]);
    const addNote = async () => {
        const newNoteRef = await addDoc(notesCollection, {
            body: "**Type your markdown note's title here**",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
        setCurrentNoteId(newNoteRef.id);
    };

    const deleteNote = async (noteId: string) => {
        const docRef = doc(firestore, "notes", noteId);
        try {
            await deleteDoc(docRef);
        } catch (error) {
            console.log(`I got an error ${error}`);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const updateNote = async (text: string) => {
                const docRef = doc(firestore, "notes", currentNoteId);
                await setDoc(
                    docRef,
                    { body: text, updatedAt: Date.now() },
                    { merge: true }
                );
            };
            updateNote(tempNoteText);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [tempNoteText, currentNoteId]);
    return (
        <main>
            {notes.length > 0 ? (
                <Split
                    style={{
                        height: "100%",
                        border: "1px solid #d5d5d5",
                        borderRadius: 3
                    }}>
                    <Sidebar
                        notes={sortedNotes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        addNote={addNote}
                        deleteNote={deleteNote}
                    />
                    <Editor
                        tempNoteText={tempNoteText}
                        setTempNoteText={setTempNoteText}
                    />
                </Split>
            ) : (
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button className="first-note" onClick={() => addNote()}>
                        Create one now
                    </button>
                </div>
            )}
        </main>
    );
}

//Editor.tsx

export default function Editor({ tempNoteText, setTempNoteText }: EditorProps) {
    const handleChange = (text?: string) => {
        if (text !== undefined) setTempNoteText(text);
    };

    return (
        <section className="pane editor">
            <MDEditor
                minHeight={200}
                value={tempNoteText}
                onChange={handleChange}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]]
                }}
            />
        </section>
    );
}

// Sidebar.tsx

export default function Sidebar({
    notes,
    currentNote,
    setCurrentNoteId,
    addNote,
    deleteNote
}: SidebarProps) {

    const noteElements = notes.map(note => {
        return (
            <div key={note.id}>
                <div
                    className={`title ${
                        note.id === currentNote.id ? "selected-note" : ""
                    }`}
                    onClick={() => setCurrentNoteId(note.id!)}>
                    <h4 className="text-snippet">{note.body?.split("\n")[0]}</h4>
                    <button
                        className="delete-btn"
                        onClick={() => deleteNote(note.id!)}>
                        <i className="gg-trash trash-icon"></i>
                    </button>
                </div>
            </div>
        );
    });

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={addNote}>
                    +
                </button>
            </div>
            {noteElements}
        </section>
    );
}

//(1)Error:
Argument of type '{ id: string; }[]' is not assignable to parameter of type 'SetStateAction<Note[]>'.
```
How to fix that? I made sereral tries and fail.

## Solution: Type Casting doc.data()
When mapping over the `snapshot.docs`, cast `doc.data()` to Note. This will align the data structure with Note[] and satisfy TypeScript's type checking.

Here’s how to apply the fix:
```ts
// Inside the App component
useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, snapshot =>
        setNotes(
            snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Note), // Cast doc.data() as Note
            }))
        )
    );
    return () => unsubscribe();
}, []);
```
### Explanation
`doc.data() as Note`: *This casting tells TypeScript to treat `doc.data()` as an object of type Note, resolving the type mismatch.*
This approach makes setNotes understand that it’s dealing with an array of Note objects, satisfying the setNotes function’s expected input of SetStateAction<Note[]>.
Additional Tips
**Check Optional Fields:** If any properties on Note are optional (e.g., body), make sure Note allows for undefined values as needed.
**Error Handling:** If doc.data() may not always return the full Note structure (e.g., in case of a data corruption), consider adding some fallback values or error handling.
This should resolve the type error you’re encountering with Firebase data! Let me know if you have more questions or if you'd like help on the performance issue next.

**Me**
This solution fix it but shift the error to the inside line:

```ts
// Inside the App component

  snapshot.docs.map(doc => ({
      id: doc.id, // Type error [^te].
      ...(doc.data() as Note)
  }))

//[^te]: Type error:
'id' is specified more than once, so this usage will be overwritten.ts(2783)
App.tsx(27, 25): This spread always overwrites this property.

```
I just changed that sugested line as:

```ts
snapshot.docs.map(doc => ({
    ...(doc.data() as Note),
        id: doc.id
     }))
```
That clear up all the type erros and appatentely it's working fine.

**AI**
Great catch! Reordering the id property after spreading doc.data() avoids the duplicate assignment issue and ensures that id always holds the value of doc.id. This approach preserves the intended structure without any conflict.

Now your Firebase data should load correctly, and TypeScript can verify that everything is in place. Nicely done handling that refinement—glad to hear it’s working smoothly now!

</details>

<details><summary>Performance issue</summary>
 
## Trying to delay the update text note
###  App Crashed
 
 Now lets try to tackle the performance issue.
 If I click in any note of the sidebar the note is updated after 500ms automatically. But I want to update it till I do some text changes on the editor. So to achieve that I put a condition like this:

 ```ts
 useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) { //This is the condition added
                const updateNote = async (text: string) => {
                    const docRef = doc(firestore, "notes", currentNoteId);
                    await setDoc(
                        docRef,
                        { body: text, updatedAt: Date.now() },
                        { merge: true }
                    );
                };
                updateNote(tempNoteText);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [tempNoteText, currentNoteId, currentNote.body]);
```
So that condition should prevent to update till the body text in the editor change. However the App crashed with this error:

```error
App.tsx:71 Uncaught TypeError: Cannot read properties of undefined (reading 'body')
    at App (App.tsx:71:50)
```

**AI** 
The crash happens because currentNote can be undefined, particularly if there are no notes or if currentNoteId doesn’t match any note ID in the notes array. When you access currentNote.body, TypeScript or JavaScript tries to read body from an undefined currentNote, leading to the error.

To fix this, you can add a check to ensure currentNote is defined before accessing its body. Here’s how to implement it safely:

## Solution
Add a check to confirm that `currentNote` exists before attempting to read `currentNote.body`.
You can handle cases where `currentNote` is `undefined` by either setting a fallback value or skipping the update entirely.
Here’s the revised `useEffect`:
```ts
useEffect(() => {
    const timeoutId = setTimeout(() => {
        // Ensure currentNote is defined and has a body
        if (currentNote && tempNoteText !== currentNote.body) {
            const updateNote = async (text: string) => {
                const docRef = doc(firestore, "notes", currentNoteId);
                await setDoc(
                    docRef,
                    { body: text, updatedAt: Date.now() },
                    { merge: true }
                );
            };
            updateNote(tempNoteText);
        }
    }, 500);

    return () => clearTimeout(timeoutId);
}, [tempNoteText, currentNoteId, currentNote?.body]); // Add optional chaining
```
## Explanation of Changes
**Check for currentNote:** `if (currentNote && tempNoteText !== currentNote.body)` ensures that `currentNote` is defined before comparing `tempNoteText` to `currentNote.body`.
**Optional chaining in dependencies:** By using `currentNote?.body`, you prevent the dependency array from crashing if `currentNote` is `undefined`.
This should prevent the crash while also maintaining the condition you added for updating only when tempNoteText changes relative to `currentNote.body`.
</details>
<details><summary>Refactoring using Context API</summary>
 
## Context API
### Definition of types in one type
 Refactoring by using the Context API[^3] simplifies the definition of types in on container type

 ```ts
 interface Note {
    id: string;
    body: string;
    createdAt: Date;
    updatedAt: Date;
}
 type TypeNoteContext = {
    notes: Note[];
    currentNote: Note;
    setCurrentNoteId: (id: string) => void;
    addNote: () => void;
    deleteNote: (id: string) => void;
    darkMode: boolean;
    toggleDarkMode: () => void
    tempNoteText: string;
    setTempNoteText: React.Dispatch<React.SetStateAction<string>>;
};
```

</details>

<details open><summary>Failed Attempt to implement useReducer hook</summary>
 
## useReducer Desition
### Summary
 
 The intention With this refactoring, I'm using useReducer to manage state transitions in a centralized, clear way, which is especially helpful as the app grows. Using useReducer with useContext will help streamline my component interactions while keeping everything type-safe.Clearly I failed in all aspects
 - It's not working
 - I found it veru confusing
 - The async functions confusme at most!

### Using an enum for `ActionType` in reducers can make our code clearer and safer by:

**Providing a single source of truth:** The enum creates a set list of possible action types, making it easy to update action names in one place. It avoids typos that might happen if you used plain strings each time and provides TypeScript's auto-complete.

**Improving type safety:** When using enum with a union type (like Action), TypeScript can catch when an invalid action type is passed. Without an enum, you'd rely on string literals, which are more error-prone.

**Better readability:** enum values are descriptive, improving code readability when you use them in a switch statement or within the reducer. This makes it immediately clear what actions the reducer supports.

In this setup, `ActionType` is reusable if you expand the app, ensuring consistency in any part of the app that uses these actions.

</details>

---

**Me**
I learned a lot in this exercise of migrating this ReactJS App to TypeScript. Your an outstanding instructor! I thing I finish with this little App. But surly will start some more and getting more confident as more I use TS.

**AI**
It’s great to see you mastering TypeScript with your React projects. You’ve tackled a wide range of important concepts and really elevated the app with both type safety and performance considerations. Keep going with the TypeScript journey—each project will deepen your confidence even more. Feel free to reach out anytime for more insights or questions. Happy coding! 

[^1]: Thou the course is outdated based on React 17 with js, it's a very good excercise!

[^2]: For security reasons I did not include my firebase config file.

[^3]: `useContext()` always looks for the closest provider above the component that calls it. It searches upwards and does not consider providers in the component from which you’re calling `useContext()`. That's why it cannot be any state in the provider.