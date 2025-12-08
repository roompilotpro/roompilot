# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RoomPilot is a full-stack co-living marketplace with a Spring Boot backend and React frontend.

## Development Commands

### First-Time Setup
```bash
./setup-dev.sh  # Creates .env.local, installs dependencies, starts PostgreSQL
```

### Running Services
```bash
./start-dev.sh          # Start all services (backend, frontend, database)
./stop-dev.sh           # Stop all services
```

Or run separately:
```bash
./start-backend.sh      # Backend only (http://localhost:8080)
./start-frontend.sh     # Frontend only (http://localhost:5173)
```

### Backend (Java/Maven)
```bash
cd backend
./mvnw test                           # Run all tests
./mvnw test -Dtest=MessageServiceTest # Run single test class
./mvnw checkstyle:check               # Lint check
./mvnw spotless:apply                 # Auto-format code
./mvnw verify                         # Full build with all checks
```

### Frontend (Node/npm)
```bash
cd frontend
npm run test                  # Run unit tests (Vitest)
npm run test -- MyComponent   # Run single test file
npm run lint                  # ESLint check
npm run format                # Prettier format
npm run build                 # Production build
npm run visual:test           # Playwright E2E tests
```

## Architecture

### Backend (`/backend`)
- **Spring Boot 3.2.0** with Java 17
- **Layered architecture**: Controller → Service → Repository → Model
- **Database**: PostgreSQL via JPA/Hibernate, migrations via Flyway
- **API docs**: Swagger UI at `/swagger-ui/index.html`
- **Code style**: Google Java Style (Checkstyle + Spotless)
- **Quality gates**: SpotBugs (static analysis), JaCoCo (40% coverage minimum)

### Frontend (`/frontend`)
- **React 19** with Vite bundler
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Structure**:
  - `src/pages/` - Page components (landlord/, tenant/ dashboards)
  - `src/components/` - Reusable components (tables/, forms/, auth/)
  - `src/services/` - API integration layer
  - `src/hooks/` - Custom React hooks
  - `src/contexts/` - React Context (ToastContext)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Code style**: ESLint + Prettier

### Database
- PostgreSQL 17 (Docker locally, Neon Cloud in production)
- Migrations in `backend/src/main/resources/db/migration/`

## CI/CD Pipeline

GitHub Actions workflow runs on PR/push to main/develop:
1. **Verify**: Tests, linting, code quality checks
2. **Build**: Docker image creation
3. **Scan**: Trivy container vulnerability scanning
4. **Deploy**: Blue-green deployment to Cloud Run with smoke tests

## Pre-commit Hooks

Git hooks (`.githooks/pre-commit`) auto-run:
- Frontend: Prettier + ESLint
- Backend: Spotless + Checkstyle

## Key Endpoints

- Backend API: `http://localhost:8080/api/`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- Frontend: `http://localhost:5173`

## Visual comparison
- In frontend/tests/visual there is testing architecture to compare static html pages with their react pages