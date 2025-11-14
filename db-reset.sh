#!/bin/bash
# Reset the PostgreSQL database

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}⚠️  This will delete all data in the database!${NC}"
echo "Are you sure you want to reset the database? (y/n)"
read -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Database reset cancelled"
    exit 0
fi

echo -e "${RED}Resetting database...${NC}"

# Stop and remove containers and volumes
docker-compose down -v

# Start fresh PostgreSQL
echo -e "${GREEN}Starting fresh PostgreSQL...${NC}"
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

echo ""
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo "The database is empty and ready for Flyway migrations."
echo "Run ./start-dev.sh to start the application with fresh data."