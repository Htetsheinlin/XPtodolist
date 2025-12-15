# Key Programming Concepts

This document explains the fundamental programming concepts used in this project. Understanding these concepts will help you learn how the application works and how to build similar applications.

## Table of Contents

- [React Hooks](#react-hooks)
- [Client Components vs Server Components](#client-components-vs-server-components)
- [Firebase Authentication Flow](#firebase-authentication-flow)
- [Firestore Real-time Listeners](#firestore-real-time-listeners)
- [TypeScript Interfaces and Types](#typescript-interfaces-and-types)
- [Next.js App Router](#nextjs-app-router)
- [Environment Variables in Next.js](#environment-variables-in-nextjs)
- [Firestore Security Rules](#firestore-security-rules)

---

## React Hooks

React Hooks are functions that let you "hook into" React features like state and lifecycle methods from functional components.

### useState Hook

The `useState` hook manages component state (data that can change).

```typescript
const [count, setCount] = useState(0);
```

**How it works:**
- `useState(0)`: Initializes state with value `0`
- Returns array: `[currentValue, setterFunction]`
- `count`: Current state value
- `setCount`: Function to update state
- Calling `setCount(5)` updates `count` to `5` and re-renders component

**Example from the project:**
```typescript
const [user, setUser] = useState<User | null>(null);
const [todos, setTodos] = useState<Todo[]>([]);
```

- `user` starts as `null` (no user logged in)
- `todos` starts as empty array `[]`
- When state changes, React automatically re-renders the component

### useEffect Hook

The `useEffect` hook performs side effects (like API calls, subscriptions) after component renders.

```typescript
useEffect(() => {
  // Code to run after render
  const unsubscribe = subscribeToData((data) => {
    setData(data);
  });
  
  // Cleanup function (runs when component unmounts)
  return () => unsubscribe();
}, [dependencies]);
```

**How it works:**
- First argument: Function to run after render
- Second argument: Dependency array `[]`
  - Empty `[]`: Run once on mount
  - `[value]`: Run when `value` changes
  - No array: Run on every render (usually avoid)

**Example from the project:**
```typescript
useEffect(() => {
  const unsubscribe = onAuthStateChange((currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe(); // Cleanup on unmount
}, []); // Run once on mount
```

**Why cleanup?**
- Prevents memory leaks
- Stops subscriptions when component unmounts
- Avoids updating state on unmounted components

---

## Client Components vs Server Components

Next.js 16 uses the App Router, which distinguishes between Server Components and Client Components.

### Server Components (Default)

- Run on the server
- Cannot use hooks (`useState`, `useEffect`)
- Cannot use browser APIs (`window`, `document`)
- Cannot handle events (`onClick`, `onChange`)
- Better for SEO and performance
- Can directly access databases and APIs

**Example:**
```typescript
// app/layout.tsx - Server Component (default)
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}
```

### Client Components

- Run in the browser
- Can use React hooks
- Can use browser APIs
- Can handle user interactions
- Must have `"use client"` directive at top

**Example:**
```typescript
// app/page.tsx - Client Component
"use client";

export default function Home() {
  const [count, setCount] = useState(0);
  
  return <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>;
}
```

**When to use Client Components:**
- Need interactivity (buttons, forms)
- Need React hooks
- Need browser APIs
- Need event handlers

**When to use Server Components:**
- Static content
- Data fetching from database
- SEO-important content
- No interactivity needed

---

## Firebase Authentication Flow

Firebase Authentication provides secure user authentication without managing passwords yourself.

### Authentication States

1. **Signed Out**: `user === null`
2. **Signed In**: `user` is a User object with properties like `uid`, `email`

### Sign Up Flow

```typescript
// 1. User enters email and password
const email = "user@example.com";
const password = "password123";

// 2. Call signUp function
const user = await signUp(email, password);

// 3. Firebase creates account and returns User object
// User is now authenticated
```

**What happens:**
- Firebase validates email format
- Checks password strength
- Creates user account
- Returns User object with unique `uid`

### Sign In Flow

```typescript
// 1. User enters credentials
const email = "user@example.com";
const password = "password123";

// 2. Call signIn function
const user = await signIn(email, password);

// 3. Firebase validates credentials
// Returns User object if valid
```

**What happens:**
- Firebase checks credentials against database
- If valid, creates authentication session
- Returns User object
- Session persists across page refreshes

### Auth State Listener

```typescript
onAuthStateChange((user) => {
  if (user) {
    // User is signed in
    console.log("Signed in:", user.email);
  } else {
    // User is signed out
    console.log("Signed out");
  }
});
```

**Why use listeners?**
- Automatically detects sign in/out
- Updates UI when auth state changes
- Handles page refreshes (session persists)
- Detects when user signs out in another tab

---

## Firestore Real-time Listeners

Firestore's `onSnapshot` provides real-time data synchronization - your UI updates automatically when data changes.

### How It Works

```typescript
const unsubscribe = onSnapshot(query, (snapshot) => {
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setData(data); // Update state
});
```

**Process:**
1. Set up listener with query
2. Firestore sends initial data
3. Firestore sends updates whenever data changes
4. Callback function runs with new data
5. Component state updates
6. UI re-renders automatically

### Example from Project

```typescript
const unsubscribe = subscribeToTodos(userId, (todos) => {
  setTodos(todos); // Updates todos state
});

// Later, when component unmounts:
unsubscribe(); // Stop listening
```

**Benefits:**
- No manual refresh needed
- Updates across all devices instantly
- Works offline (syncs when online)
- Efficient (only sends changes)

**Important:**
- Always unsubscribe to prevent memory leaks
- Use cleanup in `useEffect` return function

---

## TypeScript Interfaces and Types

TypeScript adds type safety to JavaScript, catching errors before runtime.

### Interfaces

Interfaces define the shape of objects:

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}
```

**Usage:**
```typescript
const todo: Todo = {
  id: "123",
  text: "Learn TypeScript",
  completed: false,
  createdAt: Timestamp.now()
};
```

**Benefits:**
- Autocomplete in code editor
- Type checking catches errors
- Self-documenting code
- Refactoring is safer

### Type Annotations

```typescript
// Variable types
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;

// Function parameter and return types
function add(a: number, b: number): number {
  return a + b;
}

// Array types
const todos: Todo[] = [];
const numbers: number[] = [1, 2, 3];

// Nullable types
const user: User | null = null; // Can be User or null
```

**Why use TypeScript?**
- Catches bugs early
- Better IDE support
- Easier to understand code
- Safer refactoring

---

## Next.js App Router

Next.js 16 introduced the App Router, a new routing system based on the file system.

### File-based Routing

The file structure determines routes:

```
app/
  page.tsx          → / (home page)
  about/
    page.tsx        → /about
  todos/
    page.tsx        → /todos
```

### Layouts

`layout.tsx` files wrap pages and persist across navigation:

```
app/
  layout.tsx        → Root layout (wraps all pages)
  todos/
    layout.tsx      → Layout for /todos and children
```

### Server vs Client Components

- **Default**: Server Components (better performance)
- **Add `"use client"`**: Client Components (for interactivity)

### Benefits

- Better performance (server rendering)
- Automatic code splitting
- Built-in optimizations
- Simpler routing

---

## Environment Variables in Next.js

Environment variables store sensitive configuration (API keys, database URLs) outside your code.

### Creating .env.local

Create `.env.local` in project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
```

### Accessing Variables

```typescript
// In code
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
```

### Naming Convention

- `NEXT_PUBLIC_` prefix: Exposed to browser (can be seen in client code)
- Without prefix: Server-only (more secure, but can't use in Client Components)

**Security Note:**
- `NEXT_PUBLIC_` variables are visible in browser
- Don't put secrets in `NEXT_PUBLIC_` variables
- Use server-only variables for sensitive data

### Why Use Environment Variables?

- Keep secrets out of code
- Different configs for dev/production
- Easy to change without code changes
- Can be different per developer

---

## Firestore Security Rules

Security rules control who can read/write data in Firestore. They run on Firebase servers, not in your app.

### Basic Rule Structure

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // Rules go here
    }
  }
}
```

### Common Patterns

**Require Authentication:**
```javascript
allow read, write: if request.auth != null;
```

**User Owns Document:**
```javascript
allow read, write: if request.auth.uid == resource.data.userId;
```

**Create with Own User ID:**
```javascript
allow create: if request.auth.uid == request.resource.data.userId;
```

### Project Rules Explained

```javascript
match /todos/{todoId} {
  // Read/update/delete: User must be authenticated AND own the todo
  allow read, update, delete: if 
    request.auth != null && 
    request.auth.uid == resource.data.userId;
  
  // Create: User must be authenticated AND set their own userId
  allow create: if 
    request.auth != null && 
    request.auth.uid == request.resource.data.userId;
}
```

**Key Variables:**
- `request.auth`: Current authenticated user (null if not signed in)
- `request.auth.uid`: User's unique ID
- `resource.data`: Existing document data
- `request.resource.data`: New document data being created

### Why Security Rules Matter

- Client code can be modified by users
- Rules run on Firebase servers (can't be bypassed)
- Protect user data from unauthorized access
- Enforce data validation

**Best Practice:**
- Always write security rules
- Test rules thoroughly
- Never trust client-side validation alone

---

## Additional Concepts

### Async/Await

Handles asynchronous operations (API calls, database operations):

```typescript
// Without async/await (callbacks)
addTodo(text, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});

// With async/await (cleaner)
try {
  const result = await addTodo(text);
  console.log(result);
} catch (error) {
  console.error(error);
}
```

### Error Handling

Always handle errors in async operations:

```typescript
try {
  await signIn(email, password);
  // Success
} catch (error) {
  // Handle error
  setError(error.message);
}
```

### Conditional Rendering

Render different UI based on state:

```typescript
{user ? (
  <TodoList /> // Show if user exists
) : (
  <AuthForm /> // Show if no user
)}
```

### Array Methods

Common array operations:

```typescript
// Filter
const completed = todos.filter(todo => todo.completed);

// Map (transform)
const texts = todos.map(todo => todo.text);

// Find
const todo = todos.find(todo => todo.id === "123");
```

---

## Learning Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

Understanding these concepts will help you build similar applications and extend this project with new features!

