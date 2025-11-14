#!/bin/bash
# One-time setup for local development environment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔧 Setting up Local Development Environment${NC}"

# Create logs directory
mkdir -p logs

# Check for required tools
echo -e "${BLUE}Checking prerequisites...${NC}"

command -v java >/dev/null 2>&1 || { echo "❌ Java not found. Install Java 17+"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install Node 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Install npm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found. Install Docker Desktop"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || command -v docker compose >/dev/null 2>&1 || { echo "❌ Docker Compose not found. Install Docker Desktop"; exit 1; }

echo "✅ Java: $(java -version 2>&1 | head -n 1)"
echo "✅ Node: $(node --version)"
echo "✅ npm: $(npm --version)"
echo "✅ Docker: $(docker --version)"
echo "✅ Docker Compose: available"

# Setup environment file
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local for local PostgreSQL...${NC}"
    cat > .env.local <<EOF
# Local PostgreSQL via Docker
DATABASE_URL=postgresql://roompilot:roompilot123@localhost:5432/roompilot

# For Neon (cloud database) - uncomment and configure if needed
# DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
EOF
    echo "✅ Created .env.local with local PostgreSQL configuration"
fi

# Start PostgreSQL via Docker
echo -e "${BLUE}Starting PostgreSQL database...${NC}"
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

# Setup backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend
chmod +x mvnw
./mvnw clean install -DskipTests
cd ..

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend
if [ ! -f .env.local ]; then
    cat > .env.local <<EOF
VITE_API_URL=http://localhost:8080
EOF
fi
npm install
cd ..

# Make scripts executable
chmod +x start-dev.sh
chmod +x stop-dev.sh

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Services:"
echo "  📦 PostgreSQL: localhost:5432 (running in Docker)"
echo "  🔐 Database: roompilot / User: roompilot / Password: roompilot123"
echo ""
echo "Next steps:"
echo "1. Run: ./start-dev.sh"
echo "2. Visit: http://localhost:5173"
echo ""
echo "To stop everything: ./stop-dev.sh"