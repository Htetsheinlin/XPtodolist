# Common Errors Reference

This document catalogs common error messages you may encounter when developing Next.js + TypeScript + Firebase applications. Each error includes an explanation of what it means and how to fix it.

**Note:** For troubleshooting steps and solutions, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md). This document focuses on specific error messages and their meanings.

## Table of Contents

- [TypeScript Errors](#typescript-errors)
- [Next.js Build/Runtime Errors](#nextjs-buildruntime-errors)
- [Firebase Authentication Errors](#firebase-authentication-errors)
- [Firestore Errors](#firestore-errors)
- [React/Component Errors](#reactcomponent-errors)
- [Module/Import Errors](#moduleimport-errors)
- [Environment/Configuration Errors](#environmentconfiguration-errors)
- [ESLint Errors](#eslint-errors)

---

## TypeScript Errors

### Error: `Property 'X' does not exist on type 'Y'`

**What it means:**
TypeScript cannot find the specified property on the given type. This is a compile-time type checking error.

**Common causes:**
- Property is missing from the interface/type definition
- Typo in property name (case-sensitive)
- Type mismatch - the variable is typed differently than expected
- Property exists but TypeScript can't infer it

**How to fix:**

1. **Check the interface definition:**
   ```typescript
   // In lib/todos.ts
   export interface Todo {
     id: string;
     userId: string;  // Ensure property exists here
     text: string;
     completed: boolean;
     createdAt: Timestamp;
   }
   ```

2. **Verify property name matches exactly:**
   ```typescript
   // Wrong - typo
   const userId = todo.userIdd;  // Error: Property 'userIdd' does not exist
   
   // Correct
   const userId = todo.userId;
   ```

3. **Check if you need to access nested properties:**
   ```typescript
   // If user is User | null
   // Wrong
   const email = user.email;  // Error if user might be null
   
   // Correct
   const email = user?.email;  // Optional chaining
   // Or
   if (user) {
     const email = user.email;
   }
   ```

**Prevention:**
- Use TypeScript's autocomplete to avoid typos
- Define interfaces for all data structures
- Enable strict null checks in `tsconfig.json`

---

### Error: `Type 'X' is not assignable to type 'Y'`

**What it means:**
You're trying to assign a value of one type to a variable that expects a different type. TypeScript's type system is preventing a type mismatch.

**Common causes:**
- Assigning wrong type to a variable
- Function return type doesn't match expected type
- Array/object structure doesn't match interface
- Missing required properties

**How to fix:**

1. **Check variable types:**
   ```typescript
   // Wrong
   const userId: string = 123;  // Error: Type 'number' is not assignable to type 'string'
   
   // Correct
   const userId: string = "123";
   ```

2. **Verify function return types:**
   ```typescript
   // Wrong
   function getUserId(): string {
     return null;  // Error: Type 'null' is not assignable to type 'string'
   }
   
   // Correct
   function getUserId(): string | null {
     return null;
   }
   ```

3. **Check object structure matches interface:**
   ```typescript
   // Wrong - missing required property
   const todo: Todo = {
     id: "1",
     text: "Test",
     // Missing userId, completed, createdAt
   };
   
   // Correct
   const todo: Todo = {
     id: "1",
     userId: "user123",
     text: "Test",
     completed: false,
     createdAt: Timestamp.now(),
   };
   ```

**Prevention:**
- Always type function parameters and return values
- Use interfaces for complex objects
- Let TypeScript infer types when possible

---

### Error: `Cannot find module 'X'` (TypeScript)

**What it means:**
TypeScript cannot resolve the import path. This is different from runtime module errors - this happens during compilation.

**Common causes:**
- Incorrect import path
- Missing file extension
- Path alias not configured correctly
- File doesn't exist at specified path

**How to fix:**

1. **Check import path:**
   ```typescript
   // Wrong - incorrect path
   import { auth } from "@/lib/auths";  // File doesn't exist
   
   // Correct
   import { auth } from "@/lib/auth";
   ```

2. **Verify path alias configuration:**
   ```json
   // In tsconfig.json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]  // Ensures @/ resolves to project root
       }
     }
   }
   ```

3. **Check file exists:**
   ```typescript
   // Ensure file exists at lib/auth.ts
   // Then import:
   import { auth } from "@/lib/auth";
   ```

4. **For relative imports:**
   ```typescript
   // If not using @ alias, use correct relative path
   import { auth } from "../lib/auth";  // From app/ directory
   ```

**Prevention:**
- Use the `@/` alias consistently
- Use IDE autocomplete for imports
- Keep file structure organized

---

### Error: `Parameter 'X' implicitly has an 'any' type`

**What it means:**
TypeScript's strict mode requires explicit types, but a parameter doesn't have a type annotation.

**Common causes:**
- Missing type annotation on function parameter
- `strict` mode enabled in `tsconfig.json`
- Function parameter not typed

**How to fix:**

1. **Add type annotation:**
   ```typescript
   // Wrong
   function handleClick(event) {  // Error: Parameter 'event' implicitly has 'any' type
     // ...
   }
   
   // Correct
   function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
     // ...
   }
   ```

2. **For async handlers:**
   ```typescript
   // Wrong
   const handleSubmit = async (e) => {  // Error
     e.preventDefault();
   };
   
   // Correct
   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
     e.preventDefault();
   };
   ```

3. **For error handlers:**
   ```typescript
   // Wrong
   catch (err) {  // Error: Parameter 'err' implicitly has 'any' type
     console.error(err);
   }
   
   // Correct
   catch (err: unknown) {
     console.error(err);
   }
   // Or
   catch (err: any) {  // Less strict, but works
     console.error(err);
   }
   ```

**Prevention:**
- Always type function parameters
- Keep `strict: true` in `tsconfig.json` for better type safety
- Use TypeScript's type inference for simple cases

---

### Error: `'X' is possibly 'null' or 'undefined'`

**What it means:**
TypeScript's strict null checks detected that you're accessing a property or calling a method on a value that might be `null` or `undefined`.

**Common causes:**
- Accessing properties on nullable types without checking
- Firebase Auth `currentUser` can be `null`
- Optional chaining not used
- State initialized as `null`

**How to fix:**

1. **Use optional chaining:**
   ```typescript
   // Wrong
   const email = user.email;  // Error if user might be null
   
   // Correct
   const email = user?.email;  // Returns undefined if user is null
   ```

2. **Add null checks:**
   ```typescript
   // Wrong
   useEffect(() => {
     const unsubscribe = subscribeToTodos(user.uid, callback);  // Error
   }, [user]);
   
   // Correct
   useEffect(() => {
     if (!user) return;  // Guard clause
     const unsubscribe = subscribeToTodos(user.uid, callback);
     return () => unsubscribe();
   }, [user]);
   ```

3. **Use non-null assertion (use carefully):**
   ```typescript
   // Only if you're certain it's not null
   const email = user!.email;  // ! tells TypeScript "I know this isn't null"
   ```

4. **Provide default values:**
   ```typescript
   // Wrong
   const [user, setUser] = useState<User | null>(null);
   const email = user.email;  // Error
   
   // Correct
   const email = user?.email ?? "No email";
   ```

**Prevention:**
- Always check for null/undefined before accessing properties
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Initialize state with proper types: `useState<User | null>(null)`

---

## Next.js Build/Runtime Errors

### Error: `Module not found: Can't resolve 'X'`

**What it means:**
Next.js cannot find the module you're trying to import. This is a runtime/build-time error.

**Common causes:**
- Package not installed
- Incorrect import path
- Missing file extension
- Path alias not working

**How to fix:**

1. **Install missing package:**
   ```bash
   # Error: Can't resolve 'firebase/auth'
   npm install firebase
   ```

2. **Check import path:**
   ```typescript
   // Wrong
   import { auth } from "@/lib/auth.ts";  // Don't include .ts extension
   
   // Correct
   import { auth } from "@/lib/auth";
   ```

3. **Verify path alias in next.config.ts:**
   ```typescript
   // Path aliases are configured in tsconfig.json, not next.config.ts
   // But ensure tsconfig.json has:
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

4. **Check file exists:**
   ```bash
   # Verify file exists
   ls lib/auth.ts
   ```

**Prevention:**
- Run `npm install` after adding dependencies
- Use consistent import paths
- Verify files exist before importing

---

### Error: `Hydration failed because the initial UI does not match`

**What it means:**
The HTML rendered on the server doesn't match what React renders on the client. This breaks React's hydration process.

**Common causes:**
- Using browser-only APIs during SSR
- Date/time formatting differences
- Random values or IDs generated differently
- Conditional rendering based on client-side state

**How to fix:**

1. **Use client-side only rendering:**
   ```typescript
   // Wrong - uses window during SSR
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   if (!mounted) return null;  // Prevents hydration mismatch
   ```

2. **Use `"use client"` directive:**
   ```typescript
   "use client";  // At top of file
   
   // Component that uses browser APIs
   export default function ClientComponent() {
     // ...
   }
   ```

3. **Avoid server/client differences:**
   ```typescript
   // Wrong - different on server vs client
   const timestamp = new Date().toLocaleString();
   
   // Correct - consistent
   const timestamp = Timestamp.now().toDate().toISOString();
   ```

**Prevention:**
- Mark components using browser APIs with `"use client"`
- Avoid generating random values during render
- Use consistent date/time formatting

---

### Error: `useEffect has missing dependency`

**What it means:**
ESLint's `react-hooks/exhaustive-deps` rule detected that `useEffect` uses a value that's not in the dependency array.

**Common causes:**
- Variable used in effect but not listed in dependencies
- Function called but not included
- State/props accessed but missing from array

**How to fix:**

1. **Add missing dependencies:**
   ```typescript
   // Wrong
   useEffect(() => {
     subscribeToTodos(user.uid, setTodos);  // 'user' not in deps
   }, []);  // Missing user
   
   // Correct
   useEffect(() => {
     if (!user) return;
     subscribeToTodos(user.uid, setTodos);
   }, [user]);  // Include user
   ```

2. **Use useCallback for functions:**
   ```typescript
   const handleTodos = useCallback((todos: Todo[]) => {
     setTodos(todos);
   }, []);
   
   useEffect(() => {
     if (!user) return;
     const unsubscribe = subscribeToTodos(user.uid, handleTodos);
     return () => unsubscribe();
   }, [user, handleTodos]);
   ```

3. **Disable rule if intentional:**
   ```typescript
   useEffect(() => {
     // Run once on mount only
     initializeSomething();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);  // Intentionally empty
   ```

**Prevention:**
- Always include all dependencies
- Use ESLint to catch missing dependencies
- Understand when empty deps array is appropriate

---

### Error: `Text content does not match server-rendered HTML`

**What it means:**
Similar to hydration error - the text content rendered on server differs from client render.

**Common causes:**
- Dynamic content that differs between server/client
- Date/time formatting
- User-specific content during SSR
- Random or time-based values

**How to fix:**

1. **Use client-side rendering:**
   ```typescript
   "use client";
   
   export default function Component() {
     const [mounted, setMounted] = useState(false);
     
     useEffect(() => {
       setMounted(true);
     }, []);
     
     if (!mounted) return <div>Loading...</div>;
     
     return <div>{new Date().toLocaleString()}</div>;
   }
   ```

2. **Avoid dynamic content in SSR:**
   ```typescript
   // Wrong
   <div>Current time: {new Date().toString()}</div>
   
   // Correct - use client component
   "use client";
   // Then use dynamic content
   ```

**Prevention:**
- Keep server and client renders identical
- Use `"use client"` for dynamic content
- Avoid time-based content in server components

---

### Error: `Invalid href passed to next/link`

**What it means:**
The `href` prop passed to Next.js `Link` component is invalid or malformed.

**Common causes:**
- `href` is `undefined` or `null`
- Invalid URL format
- External link without proper format
- Dynamic href not properly constructed

**How to fix:**

1. **Ensure href is valid:**
   ```typescript
   // Wrong
   <Link href={undefined}>Link</Link>  // Error
   
   // Correct
   <Link href="/page">Link</Link>
   // Or
   {href && <Link href={href}>Link</Link>}
   ```

2. **For external links:**
   ```typescript
   // Wrong
   <Link href="https://example.com">Link</Link>  // Should use <a> for external
   
   // Correct - external links
   <a href="https://example.com" target="_blank" rel="noopener noreferrer">
     Link
   </a>
   
   // Correct - internal links
   <Link href="/internal-page">Link</Link>
   ```

3. **For dynamic hrefs:**
   ```typescript
   // Wrong
   <Link href={`/todo/${todo.id}`}>  // If todo.id might be undefined
   
   // Correct
   {todo.id && <Link href={`/todo/${todo.id}`}>Link</Link>}
   ```

**Prevention:**
- Always validate href before passing to Link
- Use `<a>` for external links
- Check for undefined/null values

---

## Firebase Authentication Errors

### Error: `Firebase: Error (auth/invalid-api-key)`

**What it means:**
The Firebase API key in your configuration is invalid, missing, or incorrect.

**Common causes:**
- API key not set in environment variables
- Wrong API key copied from Firebase Console
- Environment variables not loaded
- API key restrictions blocking requests

**How to fix:**

1. **Check environment variables:**
   ```env
   # In .env.local (project root)
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your-actual-key
   ```

2. **Verify in Firebase Console:**
   - Firebase Console → Project Settings → General
   - Copy API key from "Web API Key" section
   - Ensure it matches your `.env.local`

3. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev  # Restart to load env vars
   ```

4. **Check API key restrictions:**
   - Firebase Console → Project Settings → General
   - If restrictions are enabled, ensure your domain is allowed

**Prevention:**
- Double-check API key when copying
- Use `.env.local` (not committed to git)
- Restart dev server after changing env vars

---

### Error: `Firebase: Error (auth/user-not-found)`

**What it means:**
No user account exists with the provided email address.

**Common causes:**
- User hasn't signed up yet
- Email typo
- User account was deleted
- Wrong email address

**How to fix:**

1. **Verify user exists:**
   - Firebase Console → Authentication → Users
   - Check if email exists in user list

2. **Try signing up instead:**
   ```typescript
   // User needs to sign up first
   await signUp(email, password);
   ```

3. **Check for typos:**
   ```typescript
   // Ensure email is correct (case-sensitive)
   const email = "user@example.com";  // Verify spelling
   ```

**Prevention:**
- Provide clear error messages to users
- Offer "Sign Up" option if user doesn't exist
- Validate email format before submission

---

### Error: `Firebase: Error (auth/wrong-password)`

**What it means:**
The password provided doesn't match the user's password.

**Common causes:**
- Incorrect password entered
- Password changed but user using old password
- Copy/paste error

**How to fix:**

1. **Verify password:**
   - Ask user to re-enter password
   - Check for extra spaces or characters

2. **Implement password reset:**
   ```typescript
   import { sendPasswordResetEmail } from "firebase/auth";
   
   await sendPasswordResetEmail(auth, email);
   ```

3. **Check password input:**
   ```typescript
   // Ensure no extra whitespace
   const password = passwordInput.trim();
   ```

**Prevention:**
- Provide "Forgot Password" functionality
- Show clear error messages
- Validate password strength on signup

---

### Error: `Firebase: Error (auth/email-already-in-use)`

**What it means:**
An account with this email already exists. You're trying to sign up with an email that's already registered.

**Common causes:**
- User already has an account
- Trying to sign up instead of sign in
- Email was previously registered

**How to fix:**

1. **Use sign in instead:**
   ```typescript
   // User already exists, use sign in
   try {
     await signUp(email, password);
   } catch (error: any) {
     if (error.code === "auth/email-already-in-use") {
       // Prompt user to sign in instead
       await signIn(email, password);
     }
   }
   ```

2. **Update UI:**
   ```typescript
   // Show message to user
   if (error.code === "auth/email-already-in-use") {
     setError("This email is already registered. Please sign in instead.");
   }
   ```

**Prevention:**
- Check if user exists before signup
- Provide clear messaging
- Make sign in/sign up flow clear

---

### Error: `Firebase: Error (auth/network-request-failed)`

**What it means:**
Firebase couldn't complete the request due to a network error.

**Common causes:**
- No internet connection
- Firewall blocking Firebase requests
- Network timeout
- Firebase service outage

**How to fix:**

1. **Check internet connection:**
   ```typescript
   // Add retry logic
   try {
     await signIn(email, password);
   } catch (error: any) {
     if (error.code === "auth/network-request-failed") {
       setError("Network error. Please check your connection.");
     }
   }
   ```

2. **Check Firebase status:**
   - Visit [Firebase Status Page](https://status.firebase.google.com/)
   - Verify services are operational

3. **Verify firewall settings:**
   - Ensure Firebase domains aren't blocked
   - Check corporate firewall rules

**Prevention:**
- Add retry logic for network errors
- Show user-friendly error messages
- Check network before making requests

---

### Error: `Firebase: Error (auth/too-many-requests)`

**What it means:**
Too many failed authentication attempts. Firebase has temporarily blocked requests.

**Common causes:**
- Multiple failed login attempts
- Brute force protection triggered
- Rapid repeated requests

**How to fix:**

1. **Wait and retry:**
   ```typescript
   // Wait before retrying
   if (error.code === "auth/too-many-requests") {
     setError("Too many attempts. Please wait a few minutes and try again.");
   }
   ```

2. **Implement rate limiting:**
   ```typescript
   // Add delay between attempts
   const [attempts, setAttempts] = useState(0);
   
   if (attempts > 5) {
     setError("Too many attempts. Please wait.");
     return;
   }
   ```

**Prevention:**
- Implement proper error handling
- Add delays between retries
- Show clear error messages to users

---

## Firestore Errors

### Error: `Missing or insufficient permissions`

**What it means:**
The Firestore security rules don't allow the current operation for this user.

**Common causes:**
- Security rules not deployed
- User not authenticated
- Rules don't allow the operation
- `userId` doesn't match `auth.uid`

**How to fix:**

1. **Deploy security rules:**
   ```bash
   npm run deploy:rules
   # Or
   firebase deploy --only firestore:rules
   ```

2. **Check user is authenticated:**
   ```typescript
   // Verify user is signed in
   if (!user) {
     console.error("User not authenticated");
     return;
   }
   ```

3. **Verify security rules:**
   ```javascript
   // In firestore.rules
   match /todos/{todoId} {
     allow read, write: if request.auth != null && 
       request.auth.uid == resource.data.userId;
   }
   ```

4. **Check userId matches:**
   ```typescript
   // Ensure userId matches auth.uid
   await addDoc(collection(db, "todos"), {
     userId: user.uid,  // Must match auth.uid
     text: "Todo text",
     completed: false,
     createdAt: Timestamp.now(),
   });
   ```

**Prevention:**
- Always deploy rules after changes
- Test rules in Firebase Console Rules Playground
- Ensure userId matches auth.uid

---

### Error: `Function addDoc() called with invalid data`

**What it means:**
The data you're trying to write to Firestore doesn't match the expected format or contains invalid values.

**Common causes:**
- Missing required fields
- Invalid data types
- Undefined values
- Circular references

**How to fix:**

1. **Check data structure:**
   ```typescript
   // Wrong - missing required fields
   await addDoc(collection(db, "todos"), {
     text: "Todo",
     // Missing userId, completed, createdAt
   });
   
   // Correct
   await addDoc(collection(db, "todos"), {
     userId: user.uid,
     text: "Todo text",
     completed: false,
     createdAt: Timestamp.now(),
   });
   ```

2. **Ensure no undefined values:**
   ```typescript
   // Wrong
   await addDoc(collection(db, "todos"), {
     userId: user?.uid,  // Might be undefined
     text: todoText,
   });
   
   // Correct
   if (!user || !todoText.trim()) return;
   await addDoc(collection(db, "todos"), {
     userId: user.uid,  // Guaranteed to be defined
     text: todoText.trim(),
     completed: false,
     createdAt: Timestamp.now(),
   });
   ```

3. **Use correct Firestore types:**
   ```typescript
   import { Timestamp } from "firebase/firestore";
   
   // Wrong
   createdAt: new Date(),
   
   // Correct
   createdAt: Timestamp.now(),
   ```

**Prevention:**
- Validate data before writing
- Use TypeScript interfaces to ensure structure
- Check for undefined values

---

### Error: `Document reference ID must be a valid string`

**What it means:**
You're trying to use an invalid document ID. Document IDs must be non-empty strings.

**Common causes:**
- `undefined` or `null` document ID
- Empty string as ID
- Wrong variable passed as ID
- ID not extracted correctly from document

**How to fix:**

1. **Check document ID:**
   ```typescript
   // Wrong
   const todoId = undefined;
   const todoRef = doc(db, "todos", todoId);  // Error
   
   // Correct
   const todoId = "valid-id-string";
   const todoRef = doc(db, "todos", todoId);
   ```

2. **Extract ID correctly:**
   ```typescript
   // Wrong
   const id = todo.id;  // If todo might not have id
   
   // Correct
   const todos = snapshot.docs.map((doc) => ({
     id: doc.id,  // Always available
     ...doc.data(),
   }));
   ```

3. **Validate before use:**
   ```typescript
   const handleDelete = async (id: string) => {
     if (!id || typeof id !== "string") {
       console.error("Invalid todo ID");
       return;
     }
     await deleteDoc(doc(db, "todos", id));
   };
   ```

**Prevention:**
- Always validate IDs before use
- Use TypeScript to catch type errors
- Extract IDs from Firestore documents correctly

---

### Error: `Failed to get document because the client is offline`

**What it means:**
Firestore cannot fetch the document because there's no internet connection, and the document isn't cached locally.

**Common causes:**
- No internet connection
- Firestore offline persistence not enabled
- Document not previously cached

**How to fix:**

1. **Enable offline persistence (if needed):**
   ```typescript
   import { enableIndexedDbPersistence } from "firebase/firestore";
   
   enableIndexedDbPersistence(db).catch((err) => {
     if (err.code === "failed-precondition") {
       // Multiple tabs open
     } else if (err.code === "unimplemented") {
       // Browser doesn't support
     }
   });
   ```

2. **Handle offline state:**
   ```typescript
   // Check online status
   if (!navigator.onLine) {
     setError("You're offline. Changes will sync when online.");
   }
   ```

3. **Use cached data:**
   ```typescript
   // Firestore automatically uses cache when offline
   // But you can check source:
   onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
     const source = snapshot.metadata.fromCache ? "cache" : "server";
     if (source === "cache") {
       console.log("Using cached data");
     }
   });
   ```

**Prevention:**
- Handle offline scenarios gracefully
- Show user when offline
- Enable persistence for better UX

---

## React/Component Errors

### Error: `Cannot read property 'X' of undefined`

**What it means:**
You're trying to access a property on an object that is `undefined` or `null`.

**Common causes:**
- State not initialized
- Async data not loaded yet
- Optional property accessed without check
- Component renders before data is ready

**How to fix:**

1. **Add null checks:**
   ```typescript
   // Wrong
   const email = user.email;  // Error if user is null
   
   // Correct
   const email = user?.email;  // Optional chaining
   // Or
   if (user) {
     const email = user.email;
   }
   ```

2. **Initialize state properly:**
   ```typescript
   // Wrong
   const [user, setUser] = useState();  // undefined
   const email = user.email;  // Error
   
   // Correct
   const [user, setUser] = useState<User | null>(null);
   if (user) {
     const email = user.email;
   }
   ```

3. **Add loading states:**
   ```typescript
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);
   
   useEffect(() => {
     const unsubscribe = onAuthStateChange((currentUser) => {
       setUser(currentUser);
       setLoading(false);
     });
     return () => unsubscribe();
   }, []);
   
   if (loading) return <div>Loading...</div>;
   if (!user) return <AuthForm />;
   
   // Now safe to use user.email
   return <div>{user.email}</div>;
   ```

**Prevention:**
- Always initialize state with proper types
- Use optional chaining (`?.`)
- Add loading states for async data
- Check for null/undefined before accessing properties

---

### Error: `Rendered more hooks than during the previous render`

**What it means:**
The number of React hooks called changed between renders. Hooks must be called in the same order every render.

**Common causes:**
- Conditional hook calls
- Hooks inside loops or conditions
- Early returns before hooks
- Hooks called conditionally

**How to fix:**

1. **Move hooks to top level:**
   ```typescript
   // Wrong
   function Component() {
     if (condition) {
       const [state, setState] = useState();  // Error - conditional hook
     }
   }
   
   // Correct
   function Component() {
     const [state, setState] = useState();  // Always called
     if (condition) {
       // Use state here
     }
   }
   ```

2. **Don't call hooks conditionally:**
   ```typescript
   // Wrong
   useEffect(() => {
     if (user) {
       const unsubscribe = subscribeToTodos(user.uid, callback);
       return () => unsubscribe();
     }
   }, [user]);
   
   // Correct - hook always called, but effect conditionally runs
   useEffect(() => {
     if (!user) return;  // Early return is OK
     const unsubscribe = subscribeToTodos(user.uid, callback);
     return () => unsubscribe();
   }, [user]);
   ```

3. **Keep hook order consistent:**
   ```typescript
   // Wrong - order changes
   function Component({ showExtra }) {
     const [state1, setState1] = useState();
     if (showExtra) {
       const [state2, setState2] = useState();  // Conditional
     }
     const [state3, setState3] = useState();
   }
   
   // Correct - all hooks at top
   function Component({ showExtra }) {
     const [state1, setState1] = useState();
     const [state2, setState2] = useState();
     const [state3, setState3] = useState();
     // Use conditionally later
   }
   ```

**Prevention:**
- Always call hooks at top level
- Never call hooks conditionally
- Keep hook order consistent
- Use ESLint rules to catch violations

---

### Error: `Cannot update a component while rendering a different component`

**What it means:**
You're trying to update state during render, which causes infinite loops or unexpected behavior.

**Common causes:**
- Calling setState during render
- State update in render function
- Effect missing dependency causing re-render loop

**How to fix:**

1. **Move state updates to event handlers:**
   ```typescript
   // Wrong
   function Component() {
     const [count, setCount] = useState(0);
     setCount(count + 1);  // Error - updating during render
     return <div>{count}</div>;
   }
   
   // Correct
   function Component() {
     const [count, setCount] = useState(0);
     return (
       <button onClick={() => setCount(count + 1)}>
         {count}
       </button>
     );
   }
   ```

2. **Use useEffect for side effects:**
   ```typescript
   // Wrong
   function Component({ userId }) {
     const [todos, setTodos] = useState([]);
     subscribeToTodos(userId, setTodos);  // Error - during render
     return <div>{todos.length}</div>;
   }
   
   // Correct
   function Component({ userId }) {
     const [todos, setTodos] = useState([]);
     useEffect(() => {
       const unsubscribe = subscribeToTodos(userId, setTodos);
       return () => unsubscribe();
     }, [userId]);
     return <div>{todos.length}</div>;
   }
   ```

3. **Fix dependency arrays:**
   ```typescript
   // Wrong - missing dependency causes loop
   useEffect(() => {
     setTodos([...todos, newTodo]);  // todos not in deps
   }, []);  // Empty deps but uses todos
   
   // Correct
   useEffect(() => {
     // Use functional update
     setTodos(prev => [...prev, newTodo]);
   }, [newTodo]);  // Only depend on newTodo
   ```

**Prevention:**
- Never call setState during render
- Use useEffect for side effects
- Fix dependency arrays properly
- Use functional updates when needed

---

### Error: `Objects are not valid as a React child`

**What it means:**
You're trying to render an object directly in JSX. React can only render primitives (strings, numbers) or React elements.

**Common causes:**
- Rendering object directly
- Rendering array of objects without mapping
- Date/Timestamp objects rendered directly
- Firestore Timestamp rendered directly

**How to fix:**

1. **Convert objects to strings:**
   ```typescript
   // Wrong
   return <div>{user}</div>;  // user is an object
   
   // Correct
   return <div>{user.email}</div>;  // Render property
   // Or
   return <div>{JSON.stringify(user)}</div>;  // Debug only
   ```

2. **Format dates:**
   ```typescript
   // Wrong
   return <div>{todo.createdAt}</div>;  // Timestamp object
   
   // Correct
   return <div>{todo.createdAt.toDate().toLocaleString()}</div>;
   // Or
   return <div>{new Date(todo.createdAt.seconds * 1000).toLocaleString()}</div>;
   ```

3. **Map arrays properly:**
   ```typescript
   // Wrong
   return <div>{todos}</div>;  // Array of objects
   
   // Correct
   return (
     <div>
       {todos.map(todo => (
         <div key={todo.id}>{todo.text}</div>
       ))}
     </div>
   );
   ```

**Prevention:**
- Always render primitives or React elements
- Convert dates/timestamps to strings
- Map arrays before rendering
- Use JSON.stringify only for debugging

---

## Module/Import Errors

### Error: `Cannot find module '@/lib/X'`

**What it means:**
The module resolver cannot find the file at the specified path using the `@/` alias.

**Common causes:**
- File doesn't exist
- Incorrect path
- Path alias not configured
- Typo in import path

**How to fix:**

1. **Verify file exists:**
   ```bash
   # Check if file exists
   ls lib/auth.ts
   ```

2. **Check import path:**
   ```typescript
   // Wrong
   import { auth } from "@/lib/auths";  // Typo
   
   // Correct
   import { auth } from "@/lib/auth";
   ```

3. **Verify tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]  // Should map to project root
       }
     }
   }
   ```

4. **Restart TypeScript server:**
   - VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
   - Or restart your IDE

**Prevention:**
- Use IDE autocomplete for imports
- Keep consistent file structure
- Verify path alias configuration

---

### Error: `Attempted import error: 'X' is not exported from 'Y'`

**What it means:**
You're trying to import something that isn't exported from that module.

**Common causes:**
- Function/variable not exported
- Typo in export/import name
- Wrong file imported
- Default vs named export mismatch

**How to fix:**

1. **Check exports:**
   ```typescript
   // In lib/auth.ts
   // Wrong - not exported
   function signIn() { ... }
   
   // Correct - exported
   export function signIn() { ... }
   // Or
   export const signIn = async () => { ... };
   ```

2. **Match import/export names:**
   ```typescript
   // In lib/auth.ts
   export { signIn };  // Named export
   
   // In component
   import { signIn } from "@/lib/auth";  // Correct - named import
   // Not
   import signIn from "@/lib/auth";  // Wrong - default import
   ```

3. **Check for typos:**
   ```typescript
   // Wrong
   import { signInn } from "@/lib/auth";  // Typo
   
   // Correct
   import { signIn } from "@/lib/auth";
   ```

**Prevention:**
- Use consistent export patterns
- Use IDE autocomplete
- Check export statements match imports

---

### Error: `Error: Cannot use import statement outside a module`

**What it means:**
You're using ES6 `import` syntax in a file that Node.js doesn't recognize as a module.

**Common causes:**
- Missing `"type": "module"` in package.json
- Using `.js` instead of `.mjs` for ES modules
- Config file using wrong syntax
- Node.js version too old

**How to fix:**

1. **Check package.json:**
   ```json
   {
     "type": "module"  // For ES modules
   }
   ```

2. **Use correct file extension:**
   ```typescript
   // For Next.js, use .ts or .tsx
   // Config files can use .mjs
   // eslint.config.mjs - correct
   ```

3. **For Next.js projects:**
   - Next.js handles modules automatically
   - Use `.ts`/`.tsx` for components
   - Use `.mjs` for config files if needed

**Prevention:**
- Use TypeScript files (`.ts`/`.tsx`) in Next.js
- Follow Next.js conventions
- Check Node.js version (v18+)

---

## Environment/Configuration Errors

### Error: `process.env.NEXT_PUBLIC_X is undefined`

**What it means:**
The environment variable is not accessible, likely because it's not set or not prefixed correctly.

**Common causes:**
- Variable not in `.env.local`
- Missing `NEXT_PUBLIC_` prefix
- Server not restarted
- Typo in variable name

**How to fix:**

1. **Check `.env.local` file:**
   ```env
   # In .env.local (project root)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
   ```

2. **Verify prefix:**
   ```typescript
   // Wrong - no NEXT_PUBLIC_ prefix
   const apiKey = process.env.FIREBASE_API_KEY;  // undefined on client
   
   // Correct - with prefix
   const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
   ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev  # Restart to load env vars
   ```

4. **Check for typos:**
   ```env
   # Wrong
   NEXT_PUBLIC_FIREBASE_APIKEY=value  # Missing underscore
   
   # Correct
   NEXT_PUBLIC_FIREBASE_API_KEY=value
   ```

**Prevention:**
- Always use `NEXT_PUBLIC_` prefix for client-side vars
- Restart server after changing env vars
- Double-check variable names

---

### Error: `Firebase App named '[DEFAULT]' already exists`

**What it means:**
You're trying to initialize Firebase multiple times. Firebase apps are singletons.

**Common causes:**
- `initializeApp()` called multiple times
- Hot reload in development
- Multiple Firebase config files
- App already initialized

**How to fix:**

1. **Check existing initialization:**
   ```typescript
   // In lib/firebase.ts
   import { initializeApp, getApps } from "firebase/app";
   
   // Wrong
   const app = initializeApp(firebaseConfig);  // Error if already initialized
   
   // Correct
   let app;
   if (getApps().length === 0) {
     app = initializeApp(firebaseConfig);
   } else {
     app = getApps()[0];
   }
   ```

2. **Use singleton pattern:**
   ```typescript
   // Ensure only one initialization
   const app = getApps().length === 0 
     ? initializeApp(firebaseConfig)
     : getApps()[0];
   ```

**Prevention:**
- Always check `getApps().length` before initializing
- Initialize Firebase in one central file
- Import from that file everywhere

---

## ESLint Errors

### Error: `'X' is assigned a value but never used`

**What it means:**
ESLint detected a variable that's declared but never used in the code.

**Common causes:**
- Unused import
- Variable declared but not used
- Leftover code from refactoring

**How to fix:**

1. **Remove unused imports:**
   ```typescript
   // Wrong
   import { auth, db, analytics } from "@/lib/firebase";
   // Only using auth
   
   // Correct
   import { auth } from "@/lib/firebase";
   ```

2. **Remove unused variables:**
   ```typescript
   // Wrong
   const [unusedState, setUnusedState] = useState();
   
   // Correct - remove if not needed
   // Or prefix with underscore if intentionally unused
   const [_unusedState, setUnusedState] = useState();
   ```

3. **Use variables:**
   ```typescript
   // Wrong
   const todos = await getTodos();
   // todos never used
   
   // Correct
   const todos = await getTodos();
   setTodos(todos);  // Use it
   ```

**Prevention:**
- Remove unused code regularly
- Use ESLint auto-fix
- Prefix intentionally unused vars with `_`

---

### Error: `Unexpected any. Specify a different type`

**What it means:**
ESLint's `@typescript-eslint/no-explicit-any` rule prohibits using `any` type.

**Common causes:**
- Using `any` type annotation
- Missing type definition
- Quick fix that used `any`

**How to fix:**

1. **Use proper types:**
   ```typescript
   // Wrong
   function handleError(error: any) { ... }
   
   // Correct
   function handleError(error: unknown) {
     if (error instanceof Error) {
       console.error(error.message);
     }
   }
   ```

2. **Type error objects:**
   ```typescript
   // Wrong
   catch (err: any) { ... }
   
   // Correct
   catch (err: unknown) {
     const message = err instanceof Error ? err.message : "Unknown error";
   }
   ```

3. **Define interfaces:**
   ```typescript
   // Wrong
   function processData(data: any) { ... }
   
   // Correct
   interface Data {
     id: string;
     value: number;
   }
   function processData(data: Data) { ... }
   ```

**Prevention:**
- Avoid `any` type
- Use `unknown` for truly unknown types
- Define proper interfaces
- Use TypeScript's type inference

---

## Quick Reference

### Common Fixes Checklist

When encountering errors, check these in order:

1. **TypeScript Errors:**
   - [ ] Check type definitions
   - [ ] Verify property names (case-sensitive)
   - [ ] Add null checks
   - [ ] Fix import paths

2. **Next.js Errors:**
   - [ ] Restart dev server
   - [ ] Clear `.next` cache
   - [ ] Check for hydration mismatches
   - [ ] Verify `"use client"` directive

3. **Firebase Errors:**
   - [ ] Check environment variables
   - [ ] Verify API keys
   - [ ] Deploy security rules
   - [ ] Check user authentication

4. **React Errors:**
   - [ ] Check hook order
   - [ ] Verify state initialization
   - [ ] Fix dependency arrays
   - [ ] Add loading states

5. **Module Errors:**
   - [ ] Verify file exists
   - [ ] Check import/export names
   - [ ] Restart TypeScript server
   - [ ] Verify path aliases

---

## Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Step-by-step troubleshooting guide
- [SETUP.md](./SETUP.md) - Initial setup instructions
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration
- [CODE_WALKTHROUGH.md](./CODE_WALKTHROUGH.md) - Code structure explanation

---

## Getting Help

If you encounter an error not listed here:

1. **Check the error message carefully** - It often contains clues
2. **Search online** - Copy the exact error message
3. **Check documentation:**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Firebase Documentation](https://firebase.google.com/docs)
   - [React Documentation](https://react.dev)
   - [TypeScript Documentation](https://www.typescriptlang.org/docs)

4. **Review related files:**
   - Check similar code in the project
   - Review recent changes
   - Compare with working examples

5. **Use debugging tools:**
   - Browser DevTools console
   - React DevTools
   - TypeScript compiler (`npx tsc --noEmit`)
   - ESLint (`npm run lint`)

---

Remember: Most errors are fixable with careful reading of the error message and checking your code against the examples above!

