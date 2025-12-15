# Code Walkthrough

This document provides detailed, line-by-line explanations of the codebase. Each file is broken down to help you understand how everything works.

## Table of Contents

- [lib/firebase.ts](#libfirebasets)
- [lib/auth.ts](#libauthts)
- [lib/todos.ts](#libtodosts)
- [app/page.tsx](#apppagetsx)
- [app/components/AuthForm.tsx](#appcomponentsauthformtsx)
- [app/layout.tsx](#applayouttsx)
- [app/globals.css](#appglobalscss)

---

## lib/firebase.ts

This file initializes Firebase and exports the services used throughout the application.

```typescript
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";
```

**Lines 1-4**: Import Firebase SDK functions and TypeScript types. These imports bring in:
- `initializeApp`: Creates a Firebase app instance
- `getApps`: Returns array of initialized Firebase apps
- `getAuth`: Gets the Auth service
- `getFirestore`: Gets the Firestore database service
- `getAnalytics`: Gets Analytics service
- TypeScript types for type safety

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

**Lines 6-14**: Firebase configuration object. Uses environment variables (prefixed with `NEXT_PUBLIC_`) so Next.js exposes them to the browser. These values come from your Firebase project settings.

```typescript
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
```

**Lines 16-22**: Singleton pattern for Firebase initialization. 
- Checks if Firebase is already initialized (`getApps().length === 0`)
- If not initialized, creates new app instance
- If already initialized, reuses existing instance
- Prevents multiple Firebase instances (important for Next.js server-side rendering)

```typescript
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
```

**Lines 24-25**: Initialize and export Firebase services:
- `auth`: Authentication service for user management
- `db`: Firestore database for storing todos

```typescript
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
```

**Lines 27-32**: Analytics initialization with browser check:
- Analytics only works in browser (not server-side)
- `typeof window !== "undefined"` checks if code is running in browser
- Exports app instance and analytics (may be null on server)

---

## lib/auth.ts

This file provides wrapper functions for Firebase Authentication operations.

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
```

**Lines 1-8**: Import Firebase Auth functions and the auth instance:
- `createUserWithEmailAndPassword`: Creates new user account
- `signInWithEmailAndPassword`: Signs in existing user
- `signOut`: Signs out current user (renamed to avoid conflict)
- `onAuthStateChanged`: Listens to authentication state changes
- `User`: TypeScript type for authenticated user

```typescript
export const signUp = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
```

**Lines 10-13**: Sign up function:
- `async`: Function returns a Promise
- Parameters: email and password strings
- Returns: Promise that resolves to User object
- `createUserWithEmailAndPassword`: Firebase function that creates account
- Returns the user object from the credential

```typescript
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
```

**Lines 15-18**: Sign in function:
- Similar structure to signUp
- Uses `signInWithEmailAndPassword` instead
- Authenticates existing user credentials

```typescript
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};
```

**Lines 20-22**: Sign out function:
- No parameters needed (uses current user)
- Returns Promise<void> (no return value)
- Calls Firebase signOut function

```typescript
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

**Lines 24-26**: Auth state listener wrapper:
- Takes a callback function as parameter
- Callback receives User object or null (null = signed out)
- Returns unsubscribe function (to stop listening)
- Used in components to react to auth state changes

```typescript
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
```

**Lines 28-30**: Get current user synchronously:
- Returns current authenticated user or null
- Useful for checking auth state without listener

---

## lib/todos.ts

This file handles all Firestore operations for todos.

```typescript
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
```

**Lines 1-13**: Import Firestore functions:
- `collection`: Reference to a Firestore collection
- `addDoc`: Create new document
- `updateDoc`: Update existing document
- `deleteDoc`: Delete document
- `doc`: Reference to specific document
- `query`: Create query
- `where`: Filter query results
- `onSnapshot`: Real-time listener
- `Timestamp`: Firestore timestamp type
- `QuerySnapshot`, `DocumentData`: TypeScript types

```typescript
export interface Todo {
  id: string;
  userId: string;
  owner's Firebase Auth UID
  text: string;
  todo text content
  completed: boolean;
  completion status
  createdAt: Timestamp;
  creation timestamp
}
```

**Lines 16-22**: TypeScript interface defining Todo structure:
- `id`: Document ID from Firestore
- `userId`: Links todo to user (for security)
- `text`: The todo content
- `completed`: Boolean flag for completion status
- `createdAt`: When todo was created (Firestore Timestamp)

```typescript
export const addTodo = async (userId: string, text: string): Promise<void> => {
  await addDoc(collection(db, "todos"), {
    userId,
    text,
    completed: false,
    createdAt: Timestamp.now(),
  });
};
```

**Lines 24-31**: Create new todo:
- `userId`: Owner's Firebase Auth UID
- `text`: Todo content
- `collection(db, "todos")`: Reference to "todos" collection
- `addDoc`: Creates document with auto-generated ID
- Sets `completed: false` by default
- Sets `createdAt` to current timestamp

```typescript
export const toggleTodo = async (
  userId: string,
  id: string,
  completed: boolean
): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, {
    completed,
  });
};
```

**Lines 33-42**: Toggle todo completion:
- `userId`: Not used here but kept for consistency
- `id`: Document ID to update
- `completed`: New completion status
- `doc(db, "todos", id)`: Reference to specific document
- `updateDoc`: Updates only specified fields (completed)

```typescript
export const deleteTodo = async (userId: string, id: string): Promise<void> => {
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};
```

**Lines 44-47**: Delete todo:
- `userId`: Not used (security handled by Firestore rules)
- `id`: Document ID to delete
- `deleteDoc`: Removes document from Firestore

```typescript
export const subscribeToTodos = (
  userId: string,
  callback: (todos: Todo[]) => void
): (() => void) => {
  const q = query(collection(db, "todos"), where("userId", "==", userId));
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const todos: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[];
    callback(todos);
  });
};
```

**Lines 49-62**: Real-time todo subscription:
- `userId`: Filter todos by owner
- `callback`: Function called when todos change
- Returns unsubscribe function
- `query(...where("userId", "==", userId))`: Query filtered to user's todos
- `onSnapshot`: Sets up real-time listener
- `snapshot.docs.map`: Converts Firestore documents to Todo objects
- `doc.id`: Gets document ID
- `doc.data()`: Gets document data (spread with `...`)
- Calls callback with array of todos whenever data changes

---

## app/page.tsx

The main page component that renders the todo list interface.

```typescript
"use client";

import { useEffect, useState, FormEvent } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signOut } from "@/lib/auth";
import { subscribeToTodos, addTodo, toggleTodo, deleteTodo, Todo } from "@/lib/todos";
import AuthForm from "./components/AuthForm";
```

**Line 1**: `"use client"` directive tells Next.js this is a Client Component (runs in browser, can use hooks and event handlers).

**Lines 3-7**: Imports:
- React hooks: `useEffect`, `useState`
- `FormEvent`: TypeScript type for form events
- `User`: Firebase Auth user type
- Auth functions from lib
- Todo functions and types from lib
- AuthForm component

```typescript
export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);
```

**Lines 9-14**: Component state with `useState`:
- `user`: Current authenticated user (null if signed out)
- `loading`: Initial loading state (prevents flash of wrong content)
- `todos`: Array of todo items
- `newTodoText`: Input field value for new todo
- `addingTodo`: Loading state during add operation

```typescript
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
```

**Lines 16-23**: Auth state listener effect:
- Runs once on mount (`[]` dependency array)
- `onAuthStateChange`: Sets up listener for auth state
- Callback receives current user (or null)
- Updates `user` state and sets `loading` to false
- Returns cleanup function to unsubscribe on unmount

```typescript
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const unsubscribe = subscribeToTodos(user.uid, (todosList) => {
      setTodos(todosList);
    });

    return () => unsubscribe();
  }, [user]);
```

**Lines 25-35**: Todo subscription effect:
- Runs when `user` changes (`[user]` dependency)
- If no user, clears todos and exits
- If user exists, subscribes to their todos
- `user.uid`: Firebase Auth user ID
- Callback updates `todos` state whenever Firestore data changes
- Unsubscribes when user changes or component unmounts

```typescript
  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !newTodoText.trim() || addingTodo) return;

    setAddingTodo(true);
    try {
      await addTodo(user.uid, newTodoText.trim());
      setNewTodoText("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setAddingTodo(false);
    }
  };
```

**Lines 37-50**: Add todo handler:
- `e.preventDefault()`: Prevents form submission (page reload)
- Guards: checks user exists, text not empty, not already adding
- Sets loading state
- `addTodo`: Creates todo in Firestore
- Clears input field on success
- Error handling with try/catch
- Always resets loading state in `finally`

```typescript
  const handleToggleTodo = async (id: string, completed: boolean) => {
    if (!user) return;
    try {
      await toggleTodo(user.uid, id, !completed);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };
```

**Lines 52-60**: Toggle todo handler:
- Checks user exists
- Calls `toggleTodo` with inverted completion status
- Error handling

```typescript
  const handleDeleteTodo = async (id: string) => {
    if (!user) return;
    try {
      await deleteTodo(user.uid, id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
```

**Lines 62-69**: Delete todo handler:
- Similar pattern to toggle
- Calls `deleteTodo` function

```typescript
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
```

**Lines 71-77**: Sign out handler:
- Calls `signOut` function
- Auth state listener will update `user` state automatically

```typescript
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#3A6EA5" }}>
        <div className="xp-panel" style={{ padding: "12px 24px", fontSize: "11px", color: "#000000" }}>
          Loading...
        </div>
      </div>
    );
  }
```

**Lines 79-87**: Loading state UI:
- Shows loading message while checking auth state
- Prevents flash of authentication form

```typescript
  if (!user) {
    return <AuthForm />;
  }
```

**Lines 89-91**: Show auth form if not signed in:
- Early return renders AuthForm component
- User must authenticate to see todos

```typescript
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
```

**Lines 93-97**: Calculate statistics:
- Total count
- Completed count (filter by `completed === true`)
- Pending count (total - completed)
- Percentage (rounded, handles division by zero)

**Lines 99-232**: JSX return statement with todo list UI:
- Windows XP styled components
- Statistics display
- Add todo form
- Todo items list with checkboxes and delete buttons
- Empty state message
- Helpful tips section

---

## app/components/AuthForm.tsx

The authentication form component for sign in/sign up.

```typescript
"use client";

import { useState, FormEvent } from "react";
import { signIn, signUp } from "@/lib/auth";
```

**Line 1**: Client Component directive.

**Lines 3-4**: Imports React hooks and auth functions.

```typescript
export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
```

**Lines 6-11**: Component state:
- `isSignUp`: Toggles between sign in/sign up modes
- `email`, `password`: Form input values
- `error`: Error message display
- `loading`: Loading state during auth operation

```typescript
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
```

**Lines 13-28**: Form submission handler:
- Prevents default form submission
- Clears previous errors
- Sets loading state
- Calls `signUp` or `signIn` based on mode
- Catches errors and displays message
- Resets loading state

**Lines 31-128**: JSX return with form UI:
- Windows XP styled dialog
- Welcome message
- Email and password inputs
- Error display
- Toggle button (Sign In ↔ Sign Up)
- Submit button

---

## app/layout.tsx

Root layout component that wraps all pages.

```typescript
import type { Metadata } from "next";
import "./globals.css";
```

**Lines 1-2**: Imports:
- `Metadata`: TypeScript type for page metadata
- Global CSS styles

```typescript
export const metadata: Metadata = {
  title: "My To-Do List - Windows XP | Organize Your Tasks with Nostalgic Style",
  description: "A nostalgic Windows XP-styled todo list application...",
};
```

**Lines 4-7**: Page metadata:
- Used for SEO and browser tab title
- Description for search engines and social sharing

```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

**Lines 9-21**: Root layout component:
- Wraps all pages
- Provides HTML structure
- `children`: Rendered page content
- Server Component by default (no "use client")

---

## app/globals.css

Global styles and Windows XP theme.

```css
@import "tailwindcss";
```

**Line 1**: Imports Tailwind CSS framework.

```css
:root {
  /* Windows XP Color Palette */
  --xp-taskbar-blue: #245EDB;
  --xp-window-bg: #ECE9D8;
  --xp-window-border: #808080;
  /* ... more variables ... */
}
```

**Lines 3-16**: CSS custom properties (variables):
- Define Windows XP color palette
- Can be reused throughout stylesheet
- Easy to customize theme

```css
.xp-button-raised {
  border: 2px outset var(--xp-button-face);
  background: var(--xp-button-face);
  /* ... */
}
```

**Lines 32-58**: Button styles:
- `outset` border creates raised 3D effect
- Uses CSS variables for colors
- Hover and active states for interactivity

Similar patterns for inputs, windows, title bars, checkboxes, and panels - all styled to match Windows XP aesthetic.

