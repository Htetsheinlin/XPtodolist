# My To-Do List - Windows XP Style

A nostalgic Windows XP-themed todo list application built with Next.js and Firebase. This project demonstrates modern web development practices while paying homage to the classic Windows XP interface.

## Features

- **User Authentication**: Secure email/password authentication using Firebase Auth
- **Real-time Synchronization**: Todos sync instantly across devices using Firestore
- **CRUD Operations**: Create, read, update, and delete todos
- **Progress Tracking**: View statistics including total, completed, and pending todos
- **Windows XP Theme**: Authentic Windows XP styling with classic UI elements
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom Windows XP theme
- **Backend**: Firebase
  - Authentication (Email/Password)
  - Firestore (Real-time database)
  - Analytics

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todolist
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project (see [Firebase Setup Guide](./docs/FIREBASE_SETUP.md))
   - Copy `.env.example` to `.env.local` and fill in your Firebase config values

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

For detailed setup instructions, see the [Setup Guide](./docs/SETUP.md).

## Project Structure

```
todolist/
├── app/
│   ├── components/          # React components
│   │   └── AuthForm.tsx     # Authentication form component
│   ├── globals.css          # Global styles and Windows XP theme
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main todo list page
├── lib/
│   ├── auth.ts              # Firebase authentication functions
│   ├── firebase.ts          # Firebase initialization
│   └── todos.ts             # Todo CRUD operations
├── docs/                    # Documentation
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
└── package.json             # Dependencies and scripts
```

## Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration
- **[Code Walkthrough](./docs/CODE_WALKTHROUGH.md)** - Line-by-line code explanations
- **[Concepts](./docs/CONCEPTS.md)** - Key programming concepts for students
- **[Data Flow](./docs/DATA_FLOW.md)** - Visual data flow diagrams
- **[Firebase Setup](./docs/FIREBASE_SETUP.md)** - Firebase project configuration
- **[Deployment](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[Styling](./docs/STYLING.md)** - Windows XP theme documentation
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run deploy:rules` - Deploy Firestore security rules

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

See [Firebase Setup Guide](./docs/FIREBASE_SETUP.md) for instructions on obtaining these values.

## Learning Resources

This project is designed to teach:

- **Next.js App Router**: Modern React framework with server and client components
- **React Hooks**: useState, useEffect for state management
- **Firebase Integration**: Authentication and real-time database
- **TypeScript**: Type-safe JavaScript development
- **CSS Custom Properties**: Modern CSS theming with variables
- **Component Architecture**: Building reusable React components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by the classic Windows XP interface
- Built with Next.js and Firebase
- Styled with Tailwind CSS
