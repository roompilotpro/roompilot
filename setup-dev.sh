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
    echo ""
    echo -e "${BLUE}Choose your database:${NC}"
    echo "1) Neon Cloud Database (Recommended - no Docker required)"
    echo "2) Local PostgreSQL via Docker"
    read -p "Enter choice [1-2]: " db_choice

    case $db_choice in
        1)
            echo -e "${YELLOW}Creating .env.local for Neon...${NC}"
            cat > .env.local <<'EOF'
# Database Configuration
# Toggle between Neon (cloud) and Local (Docker) by commenting/uncommenting

# Neon Cloud Database (Active)
DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require

# Local PostgreSQL via Docker
# DATABASE_URL=jdbc:postgresql://localhost:5432/roompilot?user=roompilot&password=roompilot123
EOF
            echo "✅ Created .env.local with Neon configuration"
            ;;
        2)
            echo -e "${YELLOW}Creating .env.local for local PostgreSQL...${NC}"
            cat > .env.local <<'EOF'
# Database Configuration
# Toggle between Neon (cloud) and Local (Docker) by commenting/uncommenting

# Neon Cloud Database
# DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require

# Local PostgreSQL via Docker (Active)
DATABASE_URL=jdbc:postgresql://localhost:5432/roompilot?user=roompilot&password=roompilot123
EOF
            echo "✅ Created .env.local with local PostgreSQL configuration"
            ;;
        *)
            echo -e "${RED}Invalid choice. Defaulting to Neon.${NC}"
            cat > .env.local <<'EOF'
# Database Configuration
# Toggle between Neon (cloud) and Local (Docker) by commenting/uncommenting

# Neon Cloud Database (Active)
DATABASE_URL=jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require

# Local PostgreSQL via Docker
# DATABASE_URL=jdbc:postgresql://localhost:5432/roompilot?user=roompilot&password=roompilot123
EOF
            ;;
    esac
else
    echo "✅ .env.local already exists, skipping database configuration"
    db_choice=0  # Skip PostgreSQL setup if .env.local exists
fi

# Start PostgreSQL via Docker only if local was chosen
if [ "$db_choice" = "2" ]; then
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
elif [ "$db_choice" = "1" ]; then
    echo -e "${GREEN}✅ Using Neon Cloud Database (no local PostgreSQL needed)${NC}"
fi

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
if [ "$db_choice" = "1" ]; then
    echo "Database: Neon Cloud (roompilot-dev)"
    echo "  📦 No local PostgreSQL needed"
    echo "  ✨ Flyway migrations will run automatically on first start"
elif [ "$db_choice" = "2" ]; then
    echo "Database: Local PostgreSQL"
    echo "  📦 PostgreSQL: localhost:5432 (running in Docker)"
    echo "  🔐 Database: roompilot / User: roompilot / Password: roompilot123"
    echo "  ✨ Flyway migrations will run automatically on first start"
else
    echo "Database: Using existing .env.local configuration"
fi
echo ""
echo "Next steps:"
echo "1. Run: ./start-dev.sh"
echo "2. Backend API: http://localhost:8080"
echo "3. Swagger UI: http://localhost:8080/swagger-ui/index.html"
echo "4. Frontend: http://localhost:5173"
echo ""
echo "To stop everything: ./stop-dev.sh"
echo "To switch databases: Edit .env.local and restart"