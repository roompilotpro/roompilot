#!/bin/bash
# Start both backend and frontend in development mode

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Full Stack Development Environment${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found in project root"
    echo "Please run ./setup-dev.sh first"
    exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Ensure PostgreSQL is running
echo -e "${BLUE}🐘 Checking PostgreSQL...${NC}"
if ! docker ps | grep -q roompilot-postgres; then
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    for i in {1..30}; do
        if docker-compose exec postgres pg_isready -U roompilot -d roompilot >/dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
            break
        fi
        if [ $i -eq 30 ]; then
            echo -e "${RED}❌ PostgreSQL failed to start${NC}"
            docker-compose logs postgres
            exit 1
        fi
        sleep 1
    done
else
    echo -e "${GREEN}✅ PostgreSQL is already running${NC}"
fi

# Start backend in background
echo -e "${BLUE}📦 Starting Backend (Spring Boot)...${NC}"
cd backend
./mvnw spring-boot:run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8080/actuator/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "Check logs: tail -f logs/backend.log"
        exit 1
    fi
    sleep 1
done

# Start frontend in background
echo -e "${BLUE}⚛️  Starting Frontend (React + Vite)...${NC}"
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

# Save PIDs for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo ""
echo -e "${GREEN}✅ Development environment started!${NC}"
echo ""
echo "📝 Services:"
if echo "$DATABASE_URL" | grep -q "neon.tech"; then
    echo "   Database: Neon Cloud (roompilot-dev)"
else
    echo "   Database: PostgreSQL on localhost:5432"
fi
echo "   Backend:  http://localhost:8080"
echo "   Swagger:  http://localhost:8080/swagger-ui/index.html"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📋 Logs:"
if echo "$DATABASE_URL" | grep -q "localhost"; then
    echo "   Database: docker-compose logs -f postgres"
fi
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop: ./stop-dev.sh"