# Firebase Setup Guide

This guide walks you through setting up a Firebase project for the Todo List application. Firebase provides authentication and database services for the app.

## Prerequisites

- Google account (Gmail account)
- Web browser
- Basic understanding of web development

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)

2. Click **"Add project"** or **"Create a project"**

3. **Enter project name**:
   - Name: `todo-list-app` (or your preferred name)
   - Click **Continue**

4. **Google Analytics** (optional):
   - You can enable or disable Google Analytics
   - For learning purposes, either option works
   - Click **Continue**

5. **Wait for project creation**:
   - Firebase will create your project (takes ~30 seconds)
   - Click **Continue** when done

## Step 2: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`)

2. **Register app**:
   - App nickname: `Todo List Web App` (optional)
   - **Don't check** "Also set up Firebase Hosting" (we'll use Vercel)
   - Click **Register app**

3. **Copy Firebase configuration**:
   - You'll see a code block with `firebaseConfig`
   - **Keep this page open** - you'll need these values
   - The config looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

## Step 3: Enable Authentication

1. In Firebase Console, click **Authentication** in the left sidebar

2. Click **Get started**

3. Click **Sign-in method** tab

4. Click **Email/Password**

5. **Enable Email/Password**:
   - Toggle **Email/Password** to **Enabled**
   - Leave "Email link (passwordless sign-in)" disabled
   - Click **Save**

6. You should see Email/Password listed as enabled

## Step 4: Create Firestore Database

1. In Firebase Console, click **Firestore Database** in the left sidebar

2. Click **Create database**

3. **Choose security rules**:
   - Select **Start in test mode** (we'll update rules later)
   - Click **Next**

4. **Choose location**:
   - Select a location close to you (e.g., `us-central`, `europe-west`)
   - Click **Enable**

5. **Wait for database creation** (takes ~1 minute)

## Step 5: Configure Firestore Security Rules

1. In Firestore Database, click **Rules** tab

2. **Replace the default rules** with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      // Allow read and write only if user is authenticated and owns the todo
      allow read, update, delete: if request.auth != null && 
                                  request.auth.uid == resource.data.userId;
      // Allow create only if user is authenticated and sets their own userId
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish**

**What these rules do:**
- Users must be authenticated to access todos
- Users can only read/update/delete their own todos
- Users can only create todos with their own userId

## Step 6: Get Firebase Configuration Values

You need to copy these values to your `.env.local` file:

1. Go back to **Project Settings** (gear icon next to "Project Overview")

2. Scroll down to **Your apps** section

3. Click on your web app (or the `</>` icon)

4. Scroll to **SDK setup and configuration**

5. Copy each value:

### Finding Each Value

- **apiKey**: Found in `firebaseConfig.apiKey`
- **authDomain**: Found in `firebaseConfig.authDomain` (usually `your-project-id.firebaseapp.com`)
- **projectId**: Found in `firebaseConfig.projectId`
- **storageBucket**: Found in `firebaseConfig.storageBucket` (usually `your-project-id.appspot.com`)
- **messagingSenderId**: Found in `firebaseConfig.messagingSenderId`
- **appId**: Found in `firebaseConfig.appId`
- **measurementId**: Found in `firebaseConfig.measurementId` (optional, for Analytics)

## Step 7: Configure Environment Variables

1. In your project root directory (`todolist/`), create `.env.local` file

2. Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Replace all values** with your actual Firebase config values

4. **Save the file**

**Important Notes:**
- The `NEXT_PUBLIC_` prefix is required for Next.js
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Restart your dev server after changing `.env.local`

## Step 8: Deploy Security Rules (Optional but Recommended)

You can deploy security rules from your local machine:

1. **Install Firebase CLI** (if not installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```
   - This opens your browser to authenticate

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use existing `firestore.rules` file
   - Don't overwrite existing files

4. **Deploy rules**:
   ```bash
   npm run deploy:rules
   ```
   Or directly:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Step 9: Verify Setup

Test that everything is configured correctly:

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open browser** to `http://localhost:3000`

3. **Try signing up**:
   - Enter an email and password
   - Click "Sign Up"
   - You should be redirected to the todo list

4. **Check Firebase Console**:
   - Go to **Authentication** → **Users** tab
   - You should see your new user
   - Go to **Firestore Database** → **Data** tab
   - You should see a `todos` collection

## Understanding Firebase Services

### Firebase Authentication

- **What it does**: Manages user accounts and authentication
- **What we use**: Email/Password authentication
- **Where data is stored**: Firebase manages this (not in Firestore)
- **Security**: Firebase handles password hashing and security

### Cloud Firestore

- **What it does**: NoSQL document database
- **What we store**: Todo items (text, completion status, timestamps)
- **Structure**: Collections → Documents → Fields
- **Real-time**: Automatically syncs data across clients

### Firebase Analytics (Optional)

- **What it does**: Tracks user behavior and app usage
- **What we use**: Basic page views and events
- **Privacy**: Can be disabled if desired

## Firebase Console Overview

### Key Sections

1. **Authentication**:
   - View registered users
   - Manage sign-in methods
   - See authentication logs

2. **Firestore Database**:
   - View data in database
   - Edit documents manually (for testing)
   - Monitor usage and performance
   - Manage security rules

3. **Project Settings**:
   - View app configurations
   - Manage API keys
   - Add/remove apps

## Security Best Practices

1. **Never expose sensitive data**:
   - API keys in `NEXT_PUBLIC_` are visible in browser
   - This is okay for Firebase (they're meant to be public)
   - But always use security rules to protect data

2. **Always use security rules**:
   - Client code can be modified by users
   - Rules run on Firebase servers (can't be bypassed)
   - Never trust client-side validation alone

3. **Keep rules updated**:
   - Review rules regularly
   - Test rules thoroughly
   - Deploy rules from version control

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Solution**: 
- Check that `.env.local` exists and has correct values
- Verify variable names start with `NEXT_PUBLIC_`
- Restart development server after changing `.env.local`

### Issue: "Permission denied" when accessing Firestore

**Solution**:
- Check that security rules are deployed
- Verify user is authenticated
- Check that rules match your data structure

### Issue: Can't find Firebase config values

**Solution**:
- Go to Project Settings → Your apps
- Click on web app icon
- Scroll to SDK setup section
- Copy values from `firebaseConfig` object

### Issue: Authentication not working

**Solution**:
- Verify Email/Password is enabled in Authentication → Sign-in method
- Check browser console for errors
- Verify environment variables are correct

## Next Steps

After Firebase setup:

1. ✅ Test authentication (sign up, sign in, sign out)
2. ✅ Test todo operations (add, toggle, delete)
3. ✅ Verify data appears in Firestore Console
4. ✅ Check that security rules work (try accessing another user's todos - should fail)
5. ✅ Review [Setup Guide](./SETUP.md) for local development
6. ✅ Read [Architecture Documentation](./ARCHITECTURE.md) to understand how Firebase integrates

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## Firebase Free Tier Limits

The Firebase free tier (Spark plan) includes:

- **Authentication**: Unlimited users
- **Firestore**: 
  - 1 GB storage
  - 50K reads/day
  - 20K writes/day
  - 20K deletes/day
- **Hosting**: 10 GB storage, 360 MB/day transfer

For learning and small projects, the free tier is more than enough!

---

Your Firebase project is now set up and ready to use! The application will authenticate users and store todos securely in Firestore.

