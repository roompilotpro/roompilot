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
- Database: Neon Cloud (default) or `localhost:5432` (Docker)
- Backend:  `http://localhost:8080`
- Frontend: `http://localhost:5173`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Database Management

The application supports two database options:

**Option 1: Neon Cloud Database (Default)**
- Configured in `.env.local` by default
- No Docker required
- Shared team database

**Option 2: Local PostgreSQL via Docker**
- Database: `roompilot`
- User: `roompilot`
- Password: `roompilot123`

**Toggle between databases:**
Edit `.env.local` and comment/uncomment the `DATABASE_URL` line:
```bash
# Use Neon (default)
DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?...

# Use Local Docker (comment out Neon and uncomment this)
# DATABASE_URL=jdbc:postgresql://localhost:5432/roompilot?user=roompilot&password=roompilot123
```

**Local Docker commands:**
```bash
# Reset local database (deletes all data)
./db-reset.sh

# View database logs
docker-compose logs -f postgres

# Connect to local database
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

The `.env.local` file is created automatically by `setup-dev.sh`. You can toggle between Neon (cloud) and Local (Docker) databases by editing this file:

```bash
# Neon Cloud Database (Active by default)
DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require

# Local PostgreSQL via Docker (comment out Neon and uncomment this to switch)
# DATABASE_URL=jdbc:postgresql://localhost:5432/roompilot?user=roompilot&password=roompilot123
```

After changing the database, restart the backend:
```bash
./stop-dev.sh
./start-dev.sh
```

## 🤝 Contributing
1. Create feature branch
2. Make changes
3. Test locally
4. Create pull request
