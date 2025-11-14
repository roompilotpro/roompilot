#!/bin/bash
# Stop all development services

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}🛑 Stopping Development Environment${NC}"

# Stop backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "Backend already stopped"
    rm .backend.pid
fi

# Stop frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "Frontend already stopped"
    rm .frontend.pid
fi

# Kill any remaining processes on ports
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Ask if user wants to stop PostgreSQL
echo ""
echo -e "${YELLOW}Do you want to stop PostgreSQL database? (y/n)${NC}"
read -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping PostgreSQL..."
    docker-compose down
    echo -e "${GREEN}✅ PostgreSQL stopped${NC}"
else
    echo "PostgreSQL will continue running"
    echo "To stop it later: docker-compose down"
fi

echo ""
echo -e "${GREEN}✅ Development environment stopped${NC}"