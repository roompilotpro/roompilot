#!/bin/bash
# Stop backend only

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Stopping Backend${NC}"

# Stop backend using PID file
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null || echo "Backend already stopped"
    rm .backend.pid
fi

# Kill any remaining processes on port 8080
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

echo -e "${GREEN}✅ Backend stopped${NC}"
