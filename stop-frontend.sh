#!/bin/bash
# Stop frontend only

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Frontend${NC}"

# Stop frontend using PID file
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null || echo "Frontend already stopped"
    rm .frontend.pid
fi

# Kill any remaining processes on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo -e "${GREEN}✅ Frontend stopped${NC}"
