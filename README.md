# RoomPilot - Hello World Application

Full-stack application demonstrating Java Spring Boot backend with React frontend and PostgreSQL database.

## 🚀 Quick Start (Mac/Linux)

### Prerequisites
- Java 17+
- Node.js 18+
- Docker Desktop (for local PostgreSQL)

### Setup & Run

**Option 1: Start Everything Together**
```bash
# One-time setup (installs dependencies, starts PostgreSQL)
./setup-dev.sh

# Start all services (PostgreSQL, Backend, Frontend)
./start-dev.sh

# Stop all services
./stop-dev.sh
```

**Option 2: Start Services Separately (Foreground Mode)**
```bash
# One-time setup
./setup-dev.sh

# Terminal 1: Start backend (includes PostgreSQL check)
./start-backend.sh
# Press Ctrl+C to stop

# Terminal 2: Start frontend
./start-frontend.sh
# Press Ctrl+C to stop

# Or use stop scripts to kill lingering processes:
./stop-backend.sh    # Kills any process on port 8080
./stop-frontend.sh   # Kills any process on port 5173
```

**Services available at:**
- Database: `localhost:5432` (PostgreSQL in Docker)
- Backend:  `http://localhost:8080`
- Frontend: `http://localhost:5173`

### Database Management
The application uses **local PostgreSQL via Docker** by default:
- Database: `roompilot`
- User: `roompilot`
- Password: `roompilot123`
- Connection: `postgresql://roompilot:roompilot123@localhost:5432/roompilot`

```bash
# Reset database (deletes all data)
./db-reset.sh

# View database logs
docker-compose logs -f postgres

# Connect to database
docker-compose exec postgres psql -U roompilot -d roompilot
```

## 📁 Project Structure
```
roompilot/
├── backend/          # Spring Boot API
├── frontend/         # React + Vite app
├── specs/           # Technical specifications
├── .github/         # CI/CD workflows
├── setup-dev.sh     # One-time setup script
├── start-dev.sh     # Start development
└── stop-dev.sh      # Stop development
```

## 🔧 Tech Stack
- **Backend:** Java Spring Boot, PostgreSQL, Flyway
- **Frontend:** React, Vite, Axios
- **Database:** PostgreSQL (Docker locally, Neon for cloud)
- **Local Development:** Docker Compose
- **Deployment:** Google Cloud Run (backend), Vercel (frontend)

## 📖 Documentation
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Testing Guide](./TESTING.md)
- [Technical Specification](./specs/0_roompilot.md)

## 🧪 Testing
```bash
# Backend tests
cd backend && ./mvnw test

# Frontend build test
cd frontend && npm run build
```

## 🚀 Deployment
- **Backend:** Deployed to Google Cloud Run via GitHub Actions
- **Frontend:** Auto-deployed to Vercel on push to main

## 📝 Environment Variables
The `.env.local` file is created automatically by `setup-dev.sh` with:
```
# Local PostgreSQL via Docker (default)
DATABASE_URL=postgresql://roompilot:roompilot123@localhost:5432/roompilot

# For Neon cloud database (optional)
# DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
```

## 🤝 Contributing
1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request
