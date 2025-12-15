# Setup Guide

This guide will walk you through setting up the Todo List application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Firebase Account**: Free account at [Firebase Console](https://console.firebase.google.com/)
- **Code Editor**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Verify Installation

Check that Node.js and npm are installed:

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

## Step 1: Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd todolist
```

If you don't have the repository URL, you can also download the project as a ZIP file and extract it.

## Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

This will install:
- Next.js and React
- Firebase SDK
- TypeScript
- Tailwind CSS
- ESLint and other development tools

The installation may take a few minutes. You should see a `node_modules` folder created.

## Step 3: Set Up Firebase Project

Before running the application, you need to set up a Firebase project. Follow these steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the Firebase setup wizard

For detailed Firebase setup instructions, see the [Firebase Setup Guide](./FIREBASE_SETUP.md).

## Step 4: Configure Environment Variables

After setting up Firebase, you need to configure environment variables:

1. Create a `.env.local` file in the root directory (`todolist/.env.local`)

2. Add your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Important Notes:**
- Replace all placeholder values with your actual Firebase config values
- The `NEXT_PUBLIC_` prefix is required for Next.js to expose these variables to the browser
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- See [Firebase Setup Guide](./FIREBASE_SETUP.md) for instructions on finding these values

## Step 5: Deploy Firestore Security Rules

The application uses Firestore security rules to protect user data. Deploy them:

```bash
npm run deploy:rules
```

This command deploys the rules defined in `firestore.rules` to your Firebase project.

**Note**: You may need to install Firebase CLI first:
```bash
npm install -g firebase-tools
firebase login
```

## Step 6: Run the Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:
```
  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

## Step 7: Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the authentication form. Try creating an account!

## Development Workflow

### Hot Reload

Next.js provides hot module replacement (HMR). When you save changes to files:
- The page automatically refreshes
- React components update without losing state
- CSS changes apply instantly

### File Structure

As you develop, here's where to find things:

- **Pages**: `app/page.tsx` - Main todo list page
- **Components**: `app/components/` - Reusable components
- **Library Functions**: `lib/` - Firebase and utility functions
- **Styles**: `app/globals.css` - Global styles and theme
- **Configuration**: `firebase.json`, `tsconfig.json`, etc.

### Making Changes

1. Edit files in your code editor
2. Save the file
3. Check the browser - changes should appear automatically
4. Check the terminal for any errors

## Common Setup Issues

### Issue: `npm install` fails

**Solution**: 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Issue: Environment variables not working

**Solution**:
- Ensure `.env.local` is in the root directory (same level as `package.json`)
- Check that variable names start with `NEXT_PUBLIC_`
- Restart the development server after changing `.env.local`

### Issue: Firebase connection errors

**Solution**:
- Verify all environment variables are correct
- Check Firebase project settings
- Ensure Firestore is enabled in Firebase Console
- See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more help

### Issue: Port 3000 already in use

**Solution**:
- Stop other applications using port 3000
- Or run on a different port: `npm run dev -- -p 3001`

## Next Steps

Once setup is complete:

1. **Read the Code**: Check out [CODE_WALKTHROUGH.md](./CODE_WALKTHROUGH.md) to understand how the code works
2. **Learn Concepts**: Review [CONCEPTS.md](./CONCEPTS.md) for key programming concepts
3. **Understand Data Flow**: See [DATA_FLOW.md](./DATA_FLOW.md) for how data moves through the app
4. **Customize**: Modify the code to add features or change styling

## Development Scripts

Available npm scripts:

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Build for production
- `npm run start` - Start production server (after build)
- `npm run lint` - Run ESLint to check code quality
- `npm run deploy:rules` - Deploy Firestore security rules

## Testing the Setup

To verify everything is working:

1. ✅ Development server starts without errors
2. ✅ Browser opens to `http://localhost:3000`
3. ✅ Authentication form displays
4. ✅ Can create a new account
5. ✅ Can sign in with created account
6. ✅ Can add todos after signing in
7. ✅ Todos persist after page refresh

If all these work, your setup is complete!

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review Firebase Console for errors
3. Check browser console (F12) for client-side errors
4. Check terminal for server-side errors
5. Verify all environment variables are set correctly

