#!/bin/bash
# Start backend only (foreground mode)

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Backend (Spring Boot)${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env.local file not found in project root${NC}"
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

# Start backend in foreground
echo ""
echo -e "${GREEN}📦 Starting Backend on http://localhost:8080${NC}"
echo -e "${BLUE}Press Ctrl+C to stop${NC}"
echo ""

cd backend
exec ./mvnw spring-boot:run
