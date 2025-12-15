# Troubleshooting Guide

This guide helps you resolve common issues when setting up, developing, or deploying the Todo List application. Each issue includes symptoms, causes, and step-by-step solutions.

## Table of Contents

- [Setup Issues](#setup-issues)
- [Authentication Errors](#authentication-errors)
- [Firestore Permission Errors](#firestore-permission-errors)
- [Environment Variable Issues](#environment-variable-issues)
- [Build Errors](#build-errors)
- [Real-time Sync Issues](#real-time-sync-issues)
- [Styling Issues](#styling-issues)
- [Deployment Issues](#deployment-issues)

---

## Setup Issues

### Issue: `npm install` fails

**Symptoms:**
- Error messages during `npm install`
- Missing `node_modules` folder
- Package installation errors

**Possible Causes:**
- Node.js version too old
- Network connectivity issues
- Corrupted npm cache
- Package lock file conflicts

**Solutions:**

1. **Check Node.js version**:
   ```bash
   node --version
   ```
   Should be v18 or higher. If not, [download latest Node.js](https://nodejs.org/).

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

3. **Delete and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Try alternative package manager**:
   ```bash
   # Using yarn
   yarn install
   
   # Using pnpm
   pnpm install
   ```

5. **Check network/firewall**:
   - Ensure internet connection is stable
   - Check if corporate firewall blocks npm registry
   - Try using different network

### Issue: Development server won't start

**Symptoms:**
- `npm run dev` fails
- Port 3000 already in use error
- Server crashes on startup

**Solutions:**

1. **Port already in use**:
   ```bash
   # Find process using port 3000
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   
   # Kill the process or use different port
   npm run dev -- -p 3001
   ```

2. **Check for syntax errors**:
   - Review terminal error messages
   - Check for TypeScript errors: `npm run lint`
   - Verify all files are saved correctly

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## Authentication Errors

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Symptoms:**
- Error message in browser console
- Authentication form doesn't work
- Firebase connection fails

**Solutions:**

1. **Verify environment variables**:
   - Check `.env.local` exists in project root
   - Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
   - Ensure no typos in variable names

2. **Restart development server**:
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```
   Environment variables only load on server start.

3. **Check Firebase Console**:
   - Verify API key is correct in Firebase project settings
   - Ensure Firebase project is active
   - Check if API key restrictions are blocking requests

4. **Verify variable format**:
   ```env
   # Correct format
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
   
   # Wrong (no quotes needed)
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyC..."
   ```

### Issue: "Firebase: Error (auth/user-not-found)" or "auth/wrong-password"

**Symptoms:**
- Sign in fails with error message
- User account doesn't exist error
- Wrong password error

**Solutions:**

1. **Verify user exists**:
   - Check Firebase Console → Authentication → Users
   - Verify email is correct (case-sensitive)
   - Try signing up instead of signing in

2. **Reset password** (if enabled):
   - Use Firebase Console to reset user password
   - Or implement password reset in app

3. **Check email format**:
   - Ensure email is valid format
   - No extra spaces
   - Correct domain spelling

4. **Create new account**:
   - Try signing up with different email
   - Verify sign up works correctly

### Issue: "Firebase: Error (auth/email-already-in-use)"

**Symptoms:**
- Sign up fails
- Email already registered error

**Solutions:**

1. **Sign in instead**:
   - User already exists, use sign in form
   - Or reset password if forgotten

2. **Delete user** (for testing):
   - Firebase Console → Authentication → Users
   - Delete test user
   - Sign up again

### Issue: Authentication state not persisting

**Symptoms:**
- User signed out on page refresh
- Need to sign in repeatedly
- Auth state resets

**Solutions:**

1. **Check browser settings**:
   - Ensure cookies are enabled
   - Check if private/incognito mode (may clear session)
   - Verify browser allows localStorage

2. **Check Firebase Auth persistence**:
   - Firebase Auth should persist by default
   - Verify `onAuthStateChange` listener is set up correctly
   - Check browser console for errors

3. **Verify listener cleanup**:
   ```typescript
   useEffect(() => {
     const unsubscribe = onAuthStateChange((user) => {
       setUser(user);
     });
     return () => unsubscribe(); // Important!
   }, []);
   ```

---

## Firestore Permission Errors

### Issue: "Missing or insufficient permissions"

**Symptoms:**
- Can't read todos
- Can't create/update/delete todos
- Permission denied errors in console

**Solutions:**

1. **Verify security rules are deployed**:
   ```bash
   npm run deploy:rules
   ```
   Or deploy manually:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Check security rules syntax**:
   - Open `firestore.rules`
   - Verify rules match your data structure
   - Check for syntax errors

3. **Verify user is authenticated**:
   ```typescript
   // In browser console
   console.log(auth.currentUser);
   // Should show User object, not null
   ```

4. **Check userId matches**:
   - Verify `userId` field in todos matches `auth.uid`
   - Check Firestore Console → Data to see actual data
   - Ensure `userId` is set correctly when creating todos

5. **Test rules in Firebase Console**:
   - Firebase Console → Firestore → Rules
   - Use Rules Playground to test rules
   - Verify rules allow authenticated users

### Issue: Can't access other user's todos (expected behavior)

**Symptoms:**
- Query returns empty array
- Can't see todos created by different account

**Solutions:**

**This is correct behavior!** Security rules prevent accessing other users' data.

To verify your own todos:
1. Sign in with your account
2. Check Firestore Console → Data
3. Verify `userId` field matches your `auth.uid`

---

## Environment Variable Issues

### Issue: Environment variables not working

**Symptoms:**
- `process.env.NEXT_PUBLIC_*` returns `undefined`
- Firebase config is undefined
- App fails to connect to Firebase

**Solutions:**

1. **Check file location**:
   - `.env.local` must be in project root (same level as `package.json`)
   - Not in `app/` or `lib/` directories

2. **Verify naming**:
   - Must start with `NEXT_PUBLIC_` for client-side access
   - No spaces around `=`
   - No quotes around values

3. **Restart development server**:
   ```bash
   # Stop server
   Ctrl+C
   # Start again
   npm run dev
   ```

4. **Check for typos**:
   ```env
   # Correct
   NEXT_PUBLIC_FIREBASE_API_KEY=value
   
   # Wrong
   NEXT_PUBLIC_FIREBASE_API_KEY = value  # Spaces
   NEXT_PUBLIC_FIREBASE_API_KEY="value"  # Quotes
   NEXT_PUBLIC_FIREBASE_APIKEY=value     # Missing underscore
   ```

5. **Verify file encoding**:
   - Ensure `.env.local` is UTF-8 encoded
   - No special characters in variable names

### Issue: Environment variables work locally but not in production

**Symptoms:**
- App works in development
- Fails in production/deployment
- Firebase connection errors

**Solutions:**

1. **Set variables in hosting platform**:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables

2. **Redeploy after adding variables**:
   - Variables only apply to new deployments
   - Trigger new deployment after adding variables

3. **Verify variable names match exactly**:
   - Case-sensitive
   - No extra spaces
   - Same names as `.env.local`

---

## Build Errors

### Issue: TypeScript errors during build

**Symptoms:**
- `npm run build` fails
- Type errors in terminal
- Build process stops

**Solutions:**

1. **Check TypeScript errors**:
   ```bash
   npm run lint
   ```
   Fix all TypeScript errors before building.

2. **Common TypeScript issues**:
   - Missing type annotations
   - Incorrect import paths
   - Type mismatches

3. **Verify tsconfig.json**:
   - Check `paths` configuration
   - Ensure `@/*` maps to correct directory
   - Verify `include` array includes all files

4. **Check for type errors locally first**:
   ```bash
   npx tsc --noEmit
   ```

### Issue: Module not found errors

**Symptoms:**
- "Cannot find module" errors
- Import errors
- Missing dependencies

**Solutions:**

1. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import paths**:
   ```typescript
   // Correct (using @ alias)
   import { auth } from "@/lib/auth";
   
   // Wrong
   import { auth } from "../lib/auth";  // Relative paths may fail
   ```

3. **Verify package.json**:
   - Ensure all dependencies are listed
   - Check for typos in package names
   - Run `npm install` to ensure packages are installed

---

## Real-time Sync Issues

### Issue: Todos don't update in real-time

**Symptoms:**
- Changes don't appear automatically
- Need to refresh page to see updates
- Real-time listener not working

**Solutions:**

1. **Verify subscription is active**:
   ```typescript
   useEffect(() => {
     if (!user) return;
     
     const unsubscribe = subscribeToTodos(user.uid, (todos) => {
       console.log("Todos updated:", todos); // Debug log
       setTodos(todos);
     });
     
     return () => unsubscribe();
   }, [user]);
   ```

2. **Check Firestore connection**:
   - Verify Firebase config is correct
   - Check browser console for Firestore errors
   - Ensure internet connection is active

3. **Verify query is correct**:
   - Check `subscribeToTodos` function
   - Verify `userId` matches `auth.uid`
   - Check Firestore Console for data

4. **Check for multiple subscriptions**:
   - Ensure only one subscription per user
   - Verify cleanup function runs on unmount
   - Check for memory leaks

### Issue: Todos appear multiple times

**Symptoms:**
- Duplicate todos in list
- Same todo appears several times

**Solutions:**

1. **Check for multiple subscriptions**:
   - Ensure `useEffect` cleanup runs
   - Verify only one subscription active
   - Check component doesn't re-render unnecessarily

2. **Verify data in Firestore**:
   - Check Firestore Console → Data
   - Look for duplicate documents
   - Delete duplicates if found

3. **Check query filters**:
   - Verify `where("userId", "==", userId)` is correct
   - Ensure query returns unique documents

---

## Styling Issues

### Issue: Windows XP styles not applying

**Symptoms:**
- Buttons look like default browser style
- Colors are wrong
- Styles missing

**Solutions:**

1. **Verify CSS file is imported**:
   ```typescript
   // In app/layout.tsx
   import "./globals.css";
   ```

2. **Check class names**:
   - Verify class names match exactly
   - Check for typos: `xp-button-raised` not `xp-button-raised`
   - Ensure classes are applied to elements

3. **Clear browser cache**:
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

4. **Check CSS specificity**:
   - Inspect element in browser DevTools
   - Verify styles are not overridden
   - Check for conflicting styles

### Issue: Buttons don't look 3D

**Symptoms:**
- Buttons appear flat
- No raised/pressed effect
- Border styles not working

**Solutions:**

1. **Verify border styles**:
   ```css
   /* Raised button */
   border: 2px outset var(--xp-button-face);
   
   /* Pressed button */
   border: 2px inset var(--xp-button-face);
   ```

2. **Check CSS variables**:
   - Verify `--xp-button-face` is defined
   - Ensure variables are in `:root` selector
   - Check for typos in variable names

3. **Test in different browsers**:
   - Some browsers handle `outset`/`inset` differently
   - Verify in Chrome, Firefox, Safari

---

## Deployment Issues

### Issue: Build fails on Vercel

**Symptoms:**
- Deployment fails
- Build errors in Vercel dashboard
- App doesn't deploy

**Solutions:**

1. **Check build logs**:
   - Vercel Dashboard → Deployments → Click failed deployment
   - Review error messages
   - Fix errors locally first

2. **Verify build command**:
   - Should be `npm run build`
   - Check `package.json` scripts
   - Ensure build script exists

3. **Check environment variables**:
   - Verify all variables are set in Vercel
   - Ensure variable names match exactly
   - Redeploy after adding variables

4. **Test build locally**:
   ```bash
   npm run build
   ```
   Fix any local build errors before deploying.

### Issue: App works locally but not in production

**Symptoms:**
- Works in development
- Fails in production
- Different behavior

**Solutions:**

1. **Check environment variables**:
   - Verify all variables are set in production
   - Ensure production values are correct
   - Different Firebase project? Update variables

2. **Check Firebase authorized domains**:
   - Firebase Console → Authentication → Settings
   - Add production domain to authorized domains
   - Verify domain is correct

3. **Check browser console**:
   - Open production app
   - Check for errors in console
   - Compare with local errors

4. **Verify security rules**:
   - Ensure rules are deployed
   - Check rules work in production
   - Test with production user account

---

## General Debugging Tips

### 1. Check Browser Console

Always check browser console (F12) for errors:
- JavaScript errors
- Network errors
- Firebase errors
- Console.log messages

### 2. Check Network Tab

Inspect network requests:
- Firebase API calls
- Authentication requests
- Firestore queries
- Check for failed requests

### 3. Use React DevTools

Install React DevTools browser extension:
- Inspect component state
- Check props
- Monitor re-renders
- Debug component issues

### 4. Check Firebase Console

Monitor Firebase services:
- Authentication → Users (check user accounts)
- Firestore → Data (verify data structure)
- Firestore → Rules (test security rules)

### 5. Add Debug Logging

Temporary console.logs help debug:
```typescript
console.log("User:", user);
console.log("Todos:", todos);
console.log("Error:", error);
```

### 6. Verify Dependencies

Ensure all packages are up to date:
```bash
npm outdated
npm update
```

---

## Getting More Help

If you're still stuck:

1. **Check Documentation**:
   - [Setup Guide](./SETUP.md)
   - [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - [Code Walkthrough](./CODE_WALKTHROUGH.md)

2. **Review Error Messages**:
   - Read error messages carefully
   - Search error messages online
   - Check Firebase/Next.js documentation

3. **Community Resources**:
   - [Next.js Discord](https://nextjs.org/discord)
   - [Firebase Support](https://firebase.google.com/support)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

4. **Check GitHub Issues**:
   - Search for similar issues
   - Check if issue is known
   - Report new issues with details

---

Remember: Most issues are configuration-related. Double-check your setup, environment variables, and Firebase configuration before assuming code issues!

