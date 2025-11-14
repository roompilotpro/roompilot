#!/bin/bash
# Backend development script

# Load environment variables from project root
if [ -f ../.env.local ]; then
    export $(cat ../.env.local | xargs)
fi

echo "🚀 Starting Spring Boot backend..."
echo "📊 Database: $DATABASE_URL"
./mvnw spring-boot:run