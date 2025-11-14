# Testing Instructions for Hello World Application

## Prerequisites
- Java 17+
- Node.js 18+
- Docker Desktop (for PostgreSQL)

## Quick Start - Full Stack Test
```bash
# One-time setup (installs everything, starts PostgreSQL)
./setup-dev.sh

# Start all services
./start-dev.sh

# Services available at:
# - Database: localhost:5432
# - Backend: http://localhost:8080
# - Frontend: http://localhost:5173

# Stop services
./stop-dev.sh
```

## Individual Component Tests

### 1. Database Only
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Connect to database
docker-compose exec postgres psql -U roompilot -d roompilot

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose down
```

### 2. Backend Only
```bash
# Ensure PostgreSQL is running
docker-compose up -d postgres

# Test compilation
cd backend
./mvnw clean compile

# Run backend
export $(cat ../.env.local | grep -v '^#' | xargs)
./mvnw spring-boot:run

# Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/messages
```

### 3. Frontend Only
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

## Verification Checklist
- [ ] Docker Desktop is running
- [ ] PostgreSQL container starts successfully
- [ ] Backend compiles without errors
- [ ] Backend connects to PostgreSQL
- [ ] Flyway migrations run automatically
- [ ] Backend health check passes
- [ ] Frontend starts without errors
- [ ] Messages load from database in frontend
- [ ] Can create new messages through frontend
- [ ] All three messages from seed data appear

## Testing Database
```bash
# Check if tables were created
docker-compose exec postgres psql -U roompilot -d roompilot -c "\dt"

# Check messages
docker-compose exec postgres psql -U roompilot -d roompilot -c "SELECT * FROM messages;"

# Check Flyway migrations
docker-compose exec postgres psql -U roompilot -d roompilot -c "SELECT * FROM flyway_schema_history;"
```

## Common Issues

### Docker Issues
- **Docker not running**: Start Docker Desktop
- **Port 5432 in use**: Another PostgreSQL is running, stop it or change port in docker-compose.yml
- **Container fails to start**: Check `docker-compose logs postgres`

### Database Issues
- **Connection refused**: Ensure PostgreSQL container is running: `docker ps`
- **Authentication failed**: Check credentials in .env.local match docker-compose.yml
- **Tables not created**: Flyway migrations should run automatically when backend starts

### Application Issues
- **Port 8080/5173 in use**: Run `./stop-dev.sh` to kill existing processes
- **Maven build fails**: Ensure Java 17+ is installed: `java -version`
- **npm errors**: Run `npm install` in frontend directory

## Reset Everything
```bash
# Stop all services and remove database data
./stop-dev.sh
docker-compose down -v

# Start fresh
./setup-dev.sh
./start-dev.sh
```