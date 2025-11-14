#!/bin/bash
# Start frontend only (foreground mode)

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Frontend (React + Vite)${NC}"

# Check if frontend directory exists
if [ ! -d frontend ]; then
    echo -e "${RED}❌ Error: frontend directory not found${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d frontend/node_modules ]; then
    echo -e "${RED}❌ Error: frontend dependencies not installed${NC}"
    echo "Please run ./setup-dev.sh first or 'cd frontend && npm install'"
    exit 1
fi

# Start frontend in foreground
echo ""
echo -e "${GREEN}⚛️  Starting Frontend on http://localhost:5173${NC}"
echo -e "${BLUE}Press Ctrl+C to stop${NC}"
echo ""

cd frontend
exec npm run dev
