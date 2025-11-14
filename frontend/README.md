# Hello World Frontend

React application built with Vite for the Hello World full-stack demo.

## Tech Stack
- React 18
- Vite
- Axios for API calls
- CSS for styling

## Prerequisites
- Node.js 18+
- npm or yarn

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Create `.env.local`:
```bash
VITE_API_URL=http://localhost:8080
```

### 3. Development Server

**Option 1: Using convenience script (from project root)**
```bash
cd ..
./start-frontend.sh
# Runs in foreground, press Ctrl+C to stop
```

**Option 2: Using npm directly**
```bash
npm run dev
# Runs in foreground, press Ctrl+C to stop
```

App will be available at `http://localhost:5173`

### 4. Production Build
```bash
npm run build
```
Output will be in `dist/` directory

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure
```
frontend/
├── src/
│   ├── components/    # React components
│   │   ├── MessageCard.jsx
│   │   └── MessageList.jsx
│   ├── services/      # API services
│   │   └── api.js
│   ├── config/        # Configuration
│   │   └── config.js
│   ├── App.jsx        # Main app component
│   ├── App.css        # App styles
│   └── main.jsx       # Entry point
├── public/            # Static assets
└── index.html         # HTML template
```

## Environment Variables
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)

## Features
- Display messages from database
- Create new messages
- Refresh messages
- Error handling
- Loading states

## Deployment
This app is configured for deployment to Vercel. Push to main branch for automatic deployment.
