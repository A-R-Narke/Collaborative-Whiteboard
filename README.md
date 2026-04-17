# Whiteboard Tldraw

A modern, collaborative whiteboard application built with **Next.js** and **tldraw**, featuring real-time synchronization, multi-user collaboration, and cloud persistence.

## Features

✨ **Core Features**
- **Intuitive Drawing Interface** - Powered by tldraw for a smooth drawing experience
- **Real-time Collaboration** - Multiple users can draw simultaneously with live updates
- **Cloud Persistence** - Automatic saving of boards to PostgreSQL
- **Snapshots** - Save and restore board states
- **Export Options** - Export boards as JSON, PNG, or SVG
- **User Authentication** - AWS Cognito integration with sign-up and sign-in
- **Dashboard** - Manage and access all your boards
- **WebSocket Sync** - Real-time synchronization using dedicated sync server

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) 14, React 18, [Tldraw](https://www.tldraw.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: AWS Amplify (Cognito)
- **Real-time Sync**: WebSocket server (Node.js)
- **Notifications**: [react-hot-toast](https://react-hot-toast.com/)

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **PostgreSQL** database instance
- **AWS Account** (for Cognito authentication)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityanarke5-create/collab-whiteboard.git
   cd whiteboard-tldraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/whiteboard"

   # AWS Amplify / Cognito
   NEXT_PUBLIC_AWS_REGION="your-region"
   NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID="your-user-pool-id"
   NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID="your-client-id"
   NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID="your-identity-pool-id"

   # Sync Server
   NEXT_PUBLIC_SYNC_SERVER_URL="ws://localhost:3001"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate
   ```

## Quick Start

### Development Mode

Start both the Next.js app and sync server concurrently:
```bash
npm run dev:all
```

Or run them separately in different terminals:

**Terminal 1 - Next.js Dev Server**
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

**Terminal 2 - Sync Server**
```bash
npm run sync-server
```

### Production Build

```bash
npm run build
npm start
```
