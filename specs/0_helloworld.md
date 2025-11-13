# HELLO WORLD APPLICATION — TECHNICAL SPECIFICATION v1.0

## 1. Project Overview

A simple full-stack "Hello World" application demonstrating a complete production-ready architecture with Java Spring Boot backend, React frontend, and Neon Postgres database.

**Purpose:**
- Validate the complete development and deployment pipeline
- Establish project structure and conventions
- Test integration between all technology stack components
- Create a foundational template for future features

**Scope:**
This is a minimal viable application that demonstrates:
- Backend API serving data from a database
- Frontend consuming and displaying API data
- Database persistence
- Complete CI/CD deployment to production services

## 2. Technology Stack

### Backend
- **Runtime:** Java 17+
- **Framework:** Spring Boot 3.2+
- **Build Tool:** Maven or Gradle
- **Database Driver:** PostgreSQL JDBC Driver
- **ORM:** Spring Data JPA / Hibernate
- **Database Migrations:** Flyway
- **API Documentation:** SpringDoc OpenAPI (Swagger)

### Frontend
- **Runtime:** Node.js 18+ / npm or yarn
- **Framework:** React 18+
- **Build Tool:** Vite
- **HTTP Client:** Axios or Fetch API
- **UI Library:** Plain CSS or TailwindCSS (optional)

### Database
- **Provider:** Neon (Serverless Postgres)
- **Version:** PostgreSQL 15+
- **Connection Pooling:** Built-in Neon pooling

### Deployment Platforms
- **Backend:** Google Cloud Run (containerized)
- **Frontend:** Vercel (static/SSR)
- **Database:** Neon (managed)

## 3. System Architecture

### High-Level Architecture

```
┌─────────────────┐
│                 │
│  User Browser   │
│                 │
└────────┬────────┘
         │
         │ HTTPS
         │
         ▼
┌─────────────────┐
│                 │
│  Vercel CDN     │
│  React App      │
│                 │
└────────┬────────┘
         │
         │ HTTPS/REST
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│                 │      │                  │
│  Cloud Run      │─────▶│  Neon Postgres   │
│  Spring Boot    │      │  Database        │
│                 │      │                  │
└─────────────────┘      └──────────────────┘
```

### Component Diagram

```mermaid
graph TB
    subgraph "Frontend - Vercel"
        React[React Application]
        Components[UI Components]
        API_Client[API Client]
    end

    subgraph "Backend - Cloud Run"
        SpringBoot[Spring Boot App]
        Controller[REST Controller]
        Service[Message Service]
        Repository[JPA Repository]
    end

    subgraph "Database - Neon"
        DB[(PostgreSQL)]
        Table[messages table]
    end

    React --> Components
    Components --> API_Client
    API_Client -->|HTTP GET /api/messages| Controller
    Controller --> Service
    Service --> Repository
    Repository --> Table
    Table --> DB

    style React fill:#61dafb
    style SpringBoot fill:#6db33f
    style DB fill:#336791
```

### Data Flow

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant CloudRun as Spring Boot API
    participant Neon as Neon DB

    User->>React: Visit Page
    React->>React: Mount Component
    React->>CloudRun: GET /api/messages
    CloudRun->>Neon: SELECT * FROM messages
    Neon-->>CloudRun: Return rows
    CloudRun-->>React: JSON Response
    React-->>User: Display "Hello World"
```

## 4. Database Schema

### Database Migration Strategy

**We use Flyway for all database migrations.** This ensures:
- Version-controlled schema changes
- Consistent database state across all environments
- Automatic migration on application startup
- Rollback capability and audit trail

### Table: `messages`

The messages table is created and populated automatically by Flyway migrations (see section 6 for migration scripts).

**Schema:**
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

**Fields:**
- `id` (SERIAL, PK) - Auto-incrementing unique identifier
- `content` (VARCHAR(255)) - Message text content
- `created_at` (TIMESTAMP) - Record creation timestamp
- `updated_at` (TIMESTAMP) - Record last update timestamp

**Seed Data:**
Flyway migration V2 automatically inserts three initial messages for demonstration purposes.

**Flyway Schema History:**
Flyway automatically creates a `flyway_schema_history` table to track applied migrations. Do not modify this table manually.

## 5. Backend API Specification

### Base URL
- **Local:** `http://localhost:8080`
- **Production:** `https://[your-cloud-run-url].run.app`

### Endpoints

#### 1. Health Check
```
GET /actuator/health
```
**Response:**
```json
{
  "status": "UP"
}
```

#### 2. Get All Messages
```
GET /api/messages
```
**Response:**
```json
[
  {
    "id": 1,
    "content": "Hello World from Neon Postgres!",
    "createdAt": "2025-01-13T10:00:00Z",
    "updatedAt": "2025-01-13T10:00:00Z"
  },
  {
    "id": 2,
    "content": "Welcome to the full-stack application",
    "createdAt": "2025-01-13T10:00:01Z",
    "updatedAt": "2025-01-13T10:00:01Z"
  }
]
```

#### 3. Get Single Message
```
GET /api/messages/{id}
```
**Response:**
```json
{
  "id": 1,
  "content": "Hello World from Neon Postgres!",
  "createdAt": "2025-01-13T10:00:00Z",
  "updatedAt": "2025-01-13T10:00:00Z"
}
```

#### 4. Create Message (Optional)
```
POST /api/messages
Content-Type: application/json

{
  "content": "New message"
}
```

**Response:**
```json
{
  "id": 4,
  "content": "New message",
  "createdAt": "2025-01-13T10:30:00Z",
  "updatedAt": "2025-01-13T10:30:00Z"
}
```

### CORS Configuration
- Allow origin: Vercel frontend URL
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization

## 6. Backend Implementation Details

### Project Structure
```
roompilot/                          # Project root
├── .env.local                      # Environment variables (not in git)
├── .gitignore                      # Git ignore patterns
├── setup-dev.sh                    # One-time setup (Mac/Linux)
├── start-dev.sh                    # Start services (Mac/Linux)
├── stop-dev.sh                     # Stop services (Mac/Linux)
├── start-dev.ps1                   # Start services (Windows)
├── stop-dev.ps1                    # Stop services (Windows)
├── logs/                           # Development logs (not in git)
│   ├── backend.log
│   └── frontend.log
├── .github/                        # GitHub Actions workflows
│   └── workflows/
│       ├── deploy-backend.yml      # Auto-deploy backend to Cloud Run
│       └── test-backend.yml        # Run tests on PRs
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── roompilot/
│   │   │   │           └── helloworld/
│   │   │   │               ├── HelloWorldApplication.java
│   │   │   │               ├── config/
│   │   │   │               │   └── CorsConfig.java
│   │   │   │               ├── controller/
│   │   │   │               │   └── MessageController.java
│   │   │   │               ├── model/
│   │   │   │               │   └── Message.java
│   │   │   │               ├── repository/
│   │   │   │               │   └── MessageRepository.java
│   │   │   │               └── service/
│   │   │   │                   └── MessageService.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-local.properties
│   │   │       ├── application-prod.properties
│   │   │       └── db/
│   │   │           └── migration/
│   │   │               ├── V1__create_messages_table.sql
│   │   │               └── V2__insert_seed_data.sql
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── roompilot/
│   │                   └── helloworld/
│   │                       └── MessageControllerTest.java
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml (or build.gradle)
│   ├── package.json                # NPM scripts for convenience
│   ├── dev.sh                      # Backend development script
│   └── README.md
└── frontend/
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── MessageList.jsx
    │   │   └── MessageCard.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── config/
    │       └── config.js
    ├── .env.local                  # Frontend env vars (not in git)
    ├── .gitignore
    ├── package.json                # NPM dependencies and scripts
    ├── vite.config.js
    ├── index.html
    └── README.md
```

### Key Dependencies (Maven)
```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Flyway for Database Migrations -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-database-postgresql</artifactId>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Configuration (application.properties)
```properties
# Application
spring.application.name=helloworld-api
server.port=8080

# Database - Neon Postgres
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# JPA/Hibernate - DO NOT use ddl-auto in production, use Flyway instead
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
spring.flyway.validate-on-migrate=true

# Actuator
management.endpoints.web.exposure.include=health,info,flyway
management.endpoint.health.show-details=when-authorized
```

### Flyway Migration Scripts

Flyway uses versioned SQL migration files to keep your database schema in sync. Migrations are applied automatically on application startup.

**V1__create_messages_table.sql** (src/main/resources/db/migration/)
```sql
-- Create messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for sorting
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

**V2__insert_seed_data.sql** (src/main/resources/db/migration/)
```sql
-- Insert seed data for Hello World demo
INSERT INTO messages (content) VALUES
    ('Hello World from Neon Postgres!'),
    ('Welcome to the full-stack application'),
    ('Java Spring Boot + React + Neon = Success');
```

**Flyway Naming Convention:**
- `V{version}__{description}.sql` - Versioned migrations (run once, in order)
- `R__{description}.sql` - Repeatable migrations (run on checksum change)
- Version format: `V1`, `V2`, `V1.1`, `V1.2.1`, etc.

**Important Notes:**
- Flyway automatically tracks which migrations have been applied in `flyway_schema_history` table
- Never modify a migration file after it has been applied
- Always create a new migration file for schema changes
- Migrations are executed in version order
- Failed migrations must be manually fixed before retry

**Flyway Best Practices:**

1. **Version Control:** Always commit migration files to Git before deploying
2. **Testing:** Test migrations on a development database first
3. **Backwards Compatibility:** Write migrations that don't break old code
4. **Idempotency:** Use `IF NOT EXISTS` when possible (though Flyway tracks execution)
5. **Rollback Strategy:**
   - For simple changes: Create a new migration to undo changes
   - For complex changes: Document rollback steps in migration comments
6. **Production Workflow:**
   ```
   Development → Test migrations → Code review → Deploy to staging → Deploy to production
   ```

**Future Migrations Example:**

When you need to add a new column later, create `V3__add_author_to_messages.sql`:
```sql
-- Add author column to messages table
ALTER TABLE messages ADD COLUMN author VARCHAR(100);

-- Set default value for existing rows
UPDATE messages SET author = 'System' WHERE author IS NULL;

-- Make column not null
ALTER TABLE messages ALTER COLUMN author SET NOT NULL;
```

### Dockerfile for Cloud Run
```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Cloud Run expects the service to listen on $PORT
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### .dockerignore
```
target/
.mvn/
mvnw
mvnw.cmd
.git/
.gitignore
README.md
.env
```

## 7. Frontend Implementation Details

### Frontend Project Structure Details

See the complete project structure in Section 6. Key frontend files:

```
frontend/
├── public/                         # Static assets
│   └── vite.svg
├── src/                            # Source code
│   ├── App.jsx                     # Main application component
│   ├── App.css                     # Application styles
│   ├── main.jsx                    # Entry point
│   ├── index.css                   # Global styles
│   ├── components/                 # React components
│   │   ├── MessageList.jsx         # List of messages
│   │   └── MessageCard.jsx         # Individual message card
│   ├── services/                   # API services
│   │   └── api.js                  # Backend API client
│   └── config/                     # Configuration
│       └── config.js               # App configuration
├── .env.local                      # Local environment variables (not in git)
├── .env.production                 # Production environment variables (not in git)
├── .gitignore                      # Git ignore patterns
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── index.html                      # HTML template
└── README.md                       # Frontend documentation
```

### Key Dependencies (package.json)
```json
{
  "name": "helloworld-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "eslint": "^8.55.0"
  }
}
```

### Environment Variables
**.env.local** (development):
```env
VITE_API_URL=http://localhost:8080
```

**.env.production** (production):
```env
VITE_API_URL=https://[your-cloud-run-url].run.app
```

### API Service (src/services/api.js)
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const messageService = {
  getAllMessages: () => api.get('/api/messages'),
  getMessage: (id) => api.get(`/api/messages/${id}`),
  createMessage: (content) => api.post('/api/messages', { content }),
};

export default api;
```

### Main Component (src/App.jsx)
```javascript
import { useState, useEffect } from 'react';
import { messageService } from './services/api';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await messageService.getAllMessages();
        setMessages(response.data);
      } catch (err) {
        setError('Failed to fetch messages: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World - Full Stack App</h1>
        <p className="tech-stack">
          Java Spring Boot + React + Neon Postgres
        </p>
      </header>
      <main className="message-container">
        {messages.map((message) => (
          <div key={message.id} className="message-card">
            <h2>{message.content}</h2>
            <p className="timestamp">
              Created: {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
```

## 8. Local Development Setup

### Prerequisites
- Java 17+ (JDK)
- Node.js 18+ and npm/yarn
- Git
- Docker (optional, for containerization)
- Neon account (free tier available)

### Step 1: Setup Neon Database

1. Go to https://neon.tech and create a free account
2. Create a new project named "helloworld"
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)
4. **That's it!** Flyway will automatically create tables and seed data when the backend starts

**Note:** Do NOT manually create tables or insert data. Flyway migrations will handle all database schema setup automatically on first run.

### Step 2: Setup Backend Locally

**First Time Setup:**
```bash
# Clone the repository (if not already cloned)
git clone <your-repo-url>
cd roompilot

# Navigate to backend directory
cd backend

# Create environment file for local development
cat > .env.local <<EOF
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
EOF

# Make Maven wrapper executable (Mac/Linux)
chmod +x mvnw

# Build the project
./mvnw clean install

# This will:
# - Download all dependencies
# - Compile Java code
# - Run tests
# - Package the application as a JAR file
```

**Running the Backend:**
```bash
# Option 1: Using Maven wrapper with environment variable
export DATABASE_URL="postgresql://user:password@host.neon.tech/dbname"
./mvnw spring-boot:run

# Option 2: Using Spring Boot profiles (recommended)
# Create src/main/resources/application-local.properties:
# spring.datasource.url=jdbc:postgresql://host.neon.tech:5432/dbname
# spring.datasource.username=your-username
# spring.datasource.password=your-password
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Option 3: Run the built JAR directly
./mvnw clean package
java -jar target/helloworld-api-0.0.1-SNAPSHOT.jar

# The application will start on http://localhost:8080
```

**Verify Backend is Running:**
```bash
# Check health endpoint
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}

# Check Flyway migrations
curl http://localhost:8080/actuator/flyway

# Get all messages
curl http://localhost:8080/api/messages

# Should return JSON array with 3 messages
```

**Local Development Workflow:**
```bash
# After making code changes, restart with:
./mvnw spring-boot:run

# Or use Spring Boot DevTools for auto-restart (add dependency):
# <dependency>
#   <groupId>org.springframework.boot</groupId>
#   <artifactId>spring-boot-devtools</artifactId>
#   <optional>true</optional>
# </dependency>

# Run tests
./mvnw test

# Clean rebuild
./mvnw clean install
```

### Step 3: Setup Frontend Locally

**First Time Setup:**
```bash
# From project root, navigate to frontend directory
cd frontend

# Install all dependencies
npm install

# This will:
# - Download all node_modules
# - Install React, Vite, Axios, etc.
# - Create package-lock.json (if it doesn't exist)

# Create environment file for local development
cat > .env.local <<EOF
VITE_API_URL=http://localhost:8080
EOF
```

**Running the Frontend:**
```bash
# Start development server with hot reload
npm run dev

# The application will start on http://localhost:5173
# - Auto-opens in browser
# - Hot Module Replacement (HMR) enabled
# - Changes reflect instantly without refresh

# Alternative: Specify a different port
npm run dev -- --port 3000

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

**Verify Frontend is Running:**
```bash
# 1. Open browser to http://localhost:5173

# 2. You should see:
#    - "Hello World - Full Stack App" header
#    - Three messages from the database
#    - Clean UI with no errors

# 3. Open browser console (F12) and check:
#    - No CORS errors
#    - Network tab shows successful API calls to localhost:8080
#    - No JavaScript errors

# 4. Test API integration:
#    - Messages should load from backend
#    - If backend is down, you'll see "Failed to fetch messages"
```

**Local Development Workflow:**
```bash
# Make changes to .jsx files - they hot reload automatically

# Run linter
npm run lint

# Format code (if using Prettier)
npx prettier --write src/

# Clear Vite cache if needed
rm -rf node_modules/.vite

# Reinstall dependencies (if package.json changes)
npm install

# Update dependencies
npm update
```

### Step 4: Create Development Scripts for Easy Start

To make local development easier, create these helper scripts:

#### Root-Level Scripts

**Create `start-dev.sh` in project root:**
```bash
#!/bin/bash
# Start both backend and frontend in development mode

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Full Stack Development Environment${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found in project root"
    echo "Please create .env.local with DATABASE_URL"
    exit 1
fi

# Load environment variables
export $(cat .env.local | xargs)

# Start backend in background
echo -e "${BLUE}📦 Starting Backend (Spring Boot)...${NC}"
cd backend
./mvnw spring-boot:run > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

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
echo "   Backend:  http://localhost:8080"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f logs/backend.log"
echo "   Frontend: tail -f logs/frontend.log"
echo ""
echo "🛑 To stop: ./stop-dev.sh"
```

**Create `stop-dev.sh` in project root:**
```bash
#!/bin/bash
# Stop all development services

GREEN='\033[0;32m'
RED='\033[0;31m'
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

echo -e "${GREEN}✅ Development environment stopped${NC}"
```

**Create `setup-dev.sh` in project root:**
```bash
#!/bin/bash
# One-time setup for local development environment

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 Setting up Local Development Environment${NC}"

# Create logs directory
mkdir -p logs

# Check for required tools
echo -e "${BLUE}Checking prerequisites...${NC}"

command -v java >/dev/null 2>&1 || { echo "❌ Java not found. Install Java 17+"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install Node 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Install npm"; exit 1; }

echo "✅ Java: $(java -version 2>&1 | head -n 1)"
echo "✅ Node: $(node --version)"
echo "✅ npm: $(npm --version)"

# Setup environment file
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local template...${NC}"
    cat > .env.local <<EOF
# Database connection (replace with your Neon connection string)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
EOF
    echo "⚠️  Please edit .env.local with your Neon database URL"
    echo "   Get it from: https://console.neon.tech"
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
npm install
cat > .env.local <<EOF
VITE_API_URL=http://localhost:8080
EOF
cd ..

# Make scripts executable
chmod +x start-dev.sh
chmod +x stop-dev.sh

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Neon database URL"
echo "2. Run: ./start-dev.sh"
echo "3. Visit: http://localhost:5173"
```

**Create `.env.local` template in project root:**
```bash
# Neon Database Connection
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
```

**Update `.gitignore` in project root:**
```
# Development environment
.env.local
.backend.pid
.frontend.pid
logs/

# Backend
backend/target/
backend/.mvn/
backend/mvnw
backend/mvnw.cmd

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local
```

#### Backend Scripts

**Add to `backend/package.json`** (create if doesn't exist):
```json
{
  "name": "helloworld-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "export $(cat ../.env.local | xargs) && ./mvnw spring-boot:run",
    "start:dev": "./mvnw spring-boot:run -Dspring-boot.run.profiles=local",
    "build": "./mvnw clean package",
    "test": "./mvnw test",
    "clean": "./mvnw clean"
  }
}
```

Or create `backend/dev.sh`:
```bash
#!/bin/bash
# Backend development script

# Load environment variables from project root
if [ -f ../.env.local ]; then
    export $(cat ../.env.local | xargs)
fi

echo "🚀 Starting Spring Boot backend..."
echo "📊 Database: $DATABASE_URL"
./mvnw spring-boot:run
```

#### Frontend Scripts

**Update `frontend/package.json` scripts section:**
```json
{
  "name": "helloworld-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "dev:open": "vite --open",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "clean": "rm -rf dist node_modules/.vite"
  }
}
```

#### Windows Scripts (PowerShell)

For Windows users, create these PowerShell equivalents:

**Create `start-dev.ps1` in project root:**
```powershell
# Start development environment on Windows
Write-Host "🚀 Starting Full Stack Development Environment" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found" -ForegroundColor Red
    Write-Host "Please create .env.local with DATABASE_URL"
    exit 1
}

# Load environment variables
Get-Content .env.local | ForEach-Object {
    $name, $value = $_.split('=')
    Set-Item -Path "env:$name" -Value $value
}

# Create logs directory
New-Item -ItemType Directory -Force -Path logs | Out-Null

# Start backend
Write-Host "📦 Starting Backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"

# Wait for backend
Start-Sleep -Seconds 10

# Start frontend
Write-Host "⚛️  Starting Frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8080"
Write-Host "Frontend: http://localhost:5173"
```

**Create `stop-dev.ps1` in project root:**
```powershell
# Stop development environment on Windows
Write-Host "🛑 Stopping Development Environment" -ForegroundColor Red

# Kill processes on ports
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

Write-Host "✅ Development environment stopped" -ForegroundColor Green
```

#### Quick Start Commands

**Mac/Linux - After one-time setup:**
```bash
# One-time setup
./setup-dev.sh

# Edit .env.local with your database URL
nano .env.local

# Start everything (runs in background)
./start-dev.sh

# View logs
tail -f logs/backend.log
tail -f logs/frontend.log

# Stop everything
./stop-dev.sh
```

**Windows - After one-time setup:**
```powershell
# Install dependencies manually
cd backend
.\mvnw.cmd clean install
cd ..\frontend
npm install
cd ..

# Create .env.local with DATABASE_URL

# Start everything
.\start-dev.ps1

# Stop everything
.\stop-dev.ps1
```

**Alternative: Manual start (each in separate terminal):**
```bash
# Terminal 1: Backend
cd backend
./dev.sh  # Mac/Linux
# OR
.\mvnw.cmd spring-boot:run  # Windows

# Terminal 2: Frontend
cd frontend
npm run dev:open

# Terminal 3: Testing
curl http://localhost:8080/api/messages
```

### Step 5: Full Local Stack Testing

**After running `./start-dev.sh` or starting manually:**

**Test Backend:**
```bash
# Health check
curl http://localhost:8080/actuator/health

# Get messages
curl http://localhost:8080/api/messages

# Pretty print with jq
curl http://localhost:8080/api/messages | jq .

# Check Flyway migrations
curl http://localhost:8080/actuator/flyway | jq .
```

**Test Frontend:**
```bash
# Open in browser
open http://localhost:5173

# Or use curl
curl http://localhost:5173
```

**Watch Logs:**
```bash
# Backend logs
tail -f logs/backend.log

# Frontend logs
tail -f logs/frontend.log

# Both at once
tail -f logs/*.log
```

### Verification Checklist
- [ ] Backend running on port 8080
- [ ] Health check responds: `curl http://localhost:8080/actuator/health`
- [ ] Flyway migrations applied: `curl http://localhost:8080/actuator/flyway`
- [ ] Messages endpoint works: `curl http://localhost:8080/api/messages`
- [ ] Frontend running on port 5173 (or 5174 if 5173 is taken)
- [ ] Frontend displays 3 messages from database
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful GET /api/messages request
- [ ] Can refresh page and messages still load

## 9. Deployment Instructions

### 9.1 Deploy Database to Neon

**Already completed in local setup!** Neon database is production-ready immediately.

**Post-deployment:**
1. Note the connection string
2. Ensure connection pooling is enabled (default in Neon)
3. Consider enabling branch protection for production database

### 9.2 Deploy Backend to Google Cloud Run

#### Prerequisites
- Google Cloud account with billing enabled
- gcloud CLI installed and authenticated
- Docker installed locally

#### Step-by-Step Deployment

**1. Setup Google Cloud Project**
```bash
# Login to Google Cloud
gcloud auth login

# Create new project (or use existing)
gcloud projects create helloworld-backend-001 --name="HelloWorld Backend"

# Set the project
gcloud config set project helloworld-backend-001

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

**2. Configure Environment Variables**
```bash
# Set your Neon database URL
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname"
```

**3. Build and Push Docker Image**

**Option A: Using Cloud Build (Recommended)**
```bash
# Navigate to backend directory
cd backend

# Build and push using Cloud Build
gcloud builds submit --tag gcr.io/helloworld-backend-001/helloworld-api

# This command:
# - Builds the Docker image in the cloud
# - Pushes to Google Container Registry
# - No local Docker required
```

**Option B: Using Local Docker**
```bash
# Build locally
docker build -t gcr.io/helloworld-backend-001/helloworld-api .

# Configure Docker for GCR
gcloud auth configure-docker

# Push to GCR
docker push gcr.io/helloworld-backend-001/helloworld-api
```

**4. Deploy to Cloud Run**
```bash
# Deploy the service
gcloud run deploy helloworld-api \
  --image gcr.io/helloworld-backend-001/helloworld-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="$DATABASE_URL" \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

# This will output a service URL like:
# https://helloworld-api-xyz123-uc.a.run.app
```

**5. Verify Deployment**
```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe helloworld-api \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/actuator/health

# Test messages endpoint
curl $SERVICE_URL/api/messages
```

**6. Configure Custom Domain (Optional)**
```bash
# Map custom domain
gcloud run domain-mappings create \
  --service helloworld-api \
  --domain api.yourdomain.com \
  --region us-central1

# Follow DNS instructions provided
```

#### Cloud Run Configuration Options

**Scaling:**
- Min instances: 0 (scale to zero when idle)
- Max instances: 10 (adjust based on expected traffic)
- Concurrency: 80 (default)

**Resources:**
- Memory: 512Mi (sufficient for Spring Boot)
- CPU: 1 (1 vCPU)
- Request timeout: 300s (default)

**Networking:**
- Ingress: All traffic
- Authentication: Allow unauthenticated (for public API)

#### Environment Variables in Cloud Run
```bash
# Update environment variables
gcloud run services update helloworld-api \
  --region us-central1 \
  --set-env-vars DATABASE_URL="new-connection-string"

# Or use Secret Manager (recommended for production)
gcloud secrets create database-url --data-file=-
# Enter the database URL and press Ctrl+D

gcloud run services update helloworld-api \
  --region us-central1 \
  --set-secrets DATABASE_URL=database-url:latest
```

#### Continuous Deployment with GitHub Actions

**Why CI/CD?**
- Automatic deployment when you push to main branch
- No manual deployment steps required
- Consistent and reliable deployments
- Rollback capability through Git

**Prerequisites:**
1. GitHub repository with your code
2. Google Cloud project with billing enabled
3. Service account with appropriate permissions

**Step-by-Step Setup:**

**1. Create Google Cloud Service Account for GitHub Actions**

```bash
# Set variables
export PROJECT_ID="helloworld-backend-001"
export SA_NAME="github-actions-deployer"
export SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create service account
gcloud iam service-accounts create $SA_NAME \
  --display-name="GitHub Actions Deployer" \
  --project=$PROJECT_ID

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

# Create and download service account key
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=$SA_EMAIL

# Display the key (you'll need this for GitHub Secrets)
cat ~/gcp-key.json
```

**2. Add Secrets to GitHub Repository**

Navigate to your GitHub repository:
- Go to **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GCP_PROJECT_ID` | `helloworld-backend-001` | Your Google Cloud project ID |
| `GCP_SA_KEY` | Contents of `gcp-key.json` | Service account JSON key (entire file) |
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Neon database connection string |
| `GCP_REGION` | `us-central1` | Cloud Run region |
| `SERVICE_NAME` | `helloworld-api` | Cloud Run service name |

**3. Create GitHub Actions Workflow File**

Create `.github/workflows/deploy-backend.yml` in your repository:

```yaml
name: Deploy Backend to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'
  workflow_dispatch: # Allows manual triggering

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  SERVICE_NAME: ${{ secrets.SERVICE_NAME }}
  REGION: ${{ secrets.GCP_REGION }}

jobs:
  deploy:
    name: Build and Deploy to Cloud Run
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2

    - name: Configure Docker for GCR
      run: |
        gcloud auth configure-docker

    - name: Build Docker image
      run: |
        cd backend
        docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:${{ github.sha }} .
        docker tag gcr.io/$PROJECT_ID/$SERVICE_NAME:${{ github.sha }} gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

    - name: Push Docker image to GCR
      run: |
        docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:${{ github.sha }}
        docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy $SERVICE_NAME \
          --image gcr.io/$PROJECT_ID/$SERVICE_NAME:${{ github.sha }} \
          --platform managed \
          --region $REGION \
          --allow-unauthenticated \
          --set-env-vars DATABASE_URL="${{ secrets.DATABASE_URL }}" \
          --memory 512Mi \
          --cpu 1 \
          --min-instances 0 \
          --max-instances 10 \
          --port 8080

    - name: Get Service URL
      run: |
        SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
          --region $REGION \
          --format 'value(status.url)')
        echo "Backend deployed to: $SERVICE_URL"
        echo "SERVICE_URL=$SERVICE_URL" >> $GITHUB_ENV

    - name: Test Deployment
      run: |
        echo "Testing health endpoint..."
        curl -f ${{ env.SERVICE_URL }}/actuator/health || exit 1
        echo "Health check passed!"

    - name: Deployment Summary
      run: |
        echo "✅ Deployment successful!"
        echo "🚀 Backend URL: ${{ env.SERVICE_URL }}"
        echo "📝 Commit: ${{ github.sha }}"
        echo "👤 Author: ${{ github.actor }}"
```

**4. Create Workflow for Running Tests (Optional but Recommended)**

Create `.github/workflows/test-backend.yml`:

```yaml
name: Test Backend

on:
  pull_request:
    branches:
      - main
    paths:
      - 'backend/**'
  push:
    branches:
      - main
    paths:
      - 'backend/**'

jobs:
  test:
    name: Run Backend Tests
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2/repository
        key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
        restore-keys: |
          ${{ runner.os }}-maven-

    - name: Run tests
      run: |
        cd backend
        ./mvnw test

    - name: Build application
      run: |
        cd backend
        ./mvnw clean package -DskipTests
```

**5. How It Works:**

```mermaid
graph LR
    A[Push to main] --> B[GitHub Actions Triggered]
    B --> C[Build Docker Image]
    C --> D[Push to GCR]
    D --> E[Deploy to Cloud Run]
    E --> F[Run Health Check]
    F --> G[Deployment Complete]

    style A fill:#e1f5e1
    style G fill:#e1f5e1
    style F fill:#fff4e1
```

**Workflow:**
1. Developer pushes code to `main` branch (or merges PR)
2. GitHub Actions detects changes in `backend/` directory
3. Workflow authenticates with Google Cloud
4. Builds Docker image with commit SHA tag
5. Pushes image to Google Container Registry
6. Deploys to Cloud Run with Flyway migrations
7. Runs health check to verify deployment
8. Reports success/failure

**6. Trigger Your First Deployment:**

```bash
# Make a change to backend code
cd backend
echo "// Updated" >> src/main/java/com/roompilot/helloworld/HelloWorldApplication.java

# Commit and push
git add .
git commit -m "Trigger CI/CD deployment"
git push origin main

# Watch the deployment in GitHub Actions tab
# Visit: https://github.com/your-username/your-repo/actions
```

**7. Monitor Deployments:**

- **GitHub Actions:** `https://github.com/your-username/your-repo/actions`
- **Cloud Run Console:** `https://console.cloud.google.com/run`
- **Cloud Build History:** `https://console.cloud.google.com/cloud-build/builds`

**8. Rollback if Needed:**

```bash
# List recent revisions
gcloud run revisions list --service=$SERVICE_NAME --region=$REGION

# Rollback to previous revision
gcloud run services update-traffic $SERVICE_NAME \
  --region=$REGION \
  --to-revisions=PREVIOUS_REVISION=100
```

**Best Practices:**
- ✅ Always test locally before pushing to main
- ✅ Use pull requests for code review
- ✅ Keep secrets in GitHub Secrets, never in code
- ✅ Monitor Cloud Run logs after deployment
- ✅ Set up staging environment for testing (optional)
- ✅ Use semantic versioning for tags

### 9.3 Deploy Frontend to Vercel

#### Prerequisites
- Vercel account (free tier available) - Sign up at https://vercel.com
- GitHub repository with your frontend code
- Backend deployed and URL available

#### Recommended: Automatic Deployment via GitHub Integration

**Why GitHub Integration?**
- ✅ **Fully automatic** - Deploy on every push to main
- ✅ **Preview deployments** - Automatic preview URLs for PRs
- ✅ **Zero configuration** - Vercel auto-detects Vite
- ✅ **Rollback support** - Easy rollback to previous deployments
- ✅ **No CLI needed** - Everything through the dashboard

**Step-by-Step Setup:**

**1. Sign Up and Connect GitHub**

```bash
# Visit Vercel and sign up
1. Go to https://vercel.com
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
```

**2. Import Your Repository**

1. Click **"Add New Project"** from Vercel dashboard
2. Select **"Import Git Repository"**
3. Find and select your `roompilot` repository
4. Click **"Import"**

**3. Configure Project Settings**

Vercel will auto-detect most settings, but configure these:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `dist` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |

**4. Add Environment Variables**

Before deploying, add your backend URL:

1. In the import screen, expand **"Environment Variables"**
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://helloworld-api-[your-id].run.app` (your Cloud Run URL)
   - **Environment:** Production (default)

**5. Deploy!**

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies
   - Build your React app
   - Deploy to global CDN
   - Generate production URL

**6. Verify Deployment**

After ~2 minutes:
- You'll get a URL like: `https://helloworld-frontend.vercel.app`
- Click "Visit" to see your deployed app
- Verify messages load from backend
- Check browser console for any errors

**7. Setup Automatic Deployments (Already Done!)**

Every push to `main` branch now automatically:
1. Triggers a new build
2. Deploys to production
3. Updates your live site

**Example Workflow:**
```bash
# Make frontend changes
cd frontend
# Edit src/App.jsx

# Commit and push
git add .
git commit -m "Update frontend UI"
git push origin main

# Vercel automatically deploys! 🚀
# Watch progress at https://vercel.com/dashboard
```

**8. Preview Deployments for Pull Requests**

Vercel automatically creates preview deployments for PRs:

```bash
# Create a feature branch
git checkout -b feature/new-ui

# Make changes and push
git push origin feature/new-ui

# Create PR on GitHub
# Vercel automatically deploys a preview!
# You get a unique URL: https://roompilot-git-feature-new-ui.vercel.app
```

**9. Configure Custom Domain (Optional)**

Via Vercel Dashboard:
1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

**10. Configure Additional Environment Variables (If Needed)**

Via Vercel Dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add variables for different environments:
   - **Production:** Used for `main` branch deployments
   - **Preview:** Used for PR preview deployments
   - **Development:** Used locally with `vercel dev`

Example:
| Name | Value | Environment |
|------|-------|-------------|
| `VITE_API_URL` | `https://api.prod.com` | Production |
| `VITE_API_URL` | `https://api.staging.com` | Preview |

#### Alternative: Deploy via Vercel CLI

If you prefer command-line deployment:

**1. Install Vercel CLI**
```bash
npm install -g vercel

# Login to Vercel
vercel login
```

**2. Deploy from Frontend Directory**
```bash
# Navigate to frontend directory
cd frontend

# Deploy to production
vercel --prod

# Follow the prompts
```

**3. Configure Environment Variables via CLI**
```bash
# Add production environment variable
vercel env add VITE_API_URL production
# Enter your Cloud Run URL when prompted

# Add for preview deployments
vercel env add VITE_API_URL preview

# Pull environment variables for local development
vercel env pull .env.local
```

#### Vercel Configuration Options

**Build Settings:**
- Node.js Version: 18.x
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

**Performance:**
- Automatic CDN distribution
- Edge caching enabled
- Gzip/Brotli compression

**Environment Variables:**
- Production: `VITE_API_URL` (Cloud Run URL)
- Preview: Can set different URL for staging
- Development: Local development URL

#### Continuous Deployment Summary

**Vercel automatically deploys when you push to your Git repository:**

**Main Branch Deployments (Production):**
- ✅ Push to `main` → Automatic production deployment
- ✅ Uses production environment variables
- ✅ Updates live site immediately
- ✅ Deployed to: `https://your-app.vercel.app`

**Pull Request Deployments (Preview):**
- ✅ Open PR → Automatic preview deployment
- ✅ Unique URL for each PR
- ✅ Can use preview environment variables
- ✅ Deployed to: `https://your-app-git-branch-name.vercel.app`

**Disable Auto-Deploy (if needed):**
```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "feature-branch": false
    }
  }
}
```

**Monitor Deployments:**
- Dashboard: https://vercel.com/dashboard
- Build logs available for each deployment
- Real-time deployment status
- Integration with GitHub commit status checks

### 9.4 Complete CI/CD Workflow Summary

Once GitHub Actions and Vercel are configured, your complete deployment workflow looks like this:

```mermaid
graph TB
    A[Developer makes changes] --> B[Commit & Push to GitHub]
    B --> C{Branch?}

    C -->|main branch| D1[GitHub Actions: Backend]
    C -->|main branch| D2[Vercel: Frontend]
    C -->|feature branch| E1[Vercel Preview]

    D1 --> F1[Build Docker Image]
    F1 --> G1[Deploy to Cloud Run]
    G1 --> H1[Flyway Migrations]
    H1 --> I1[Health Check]
    I1 --> J1[Backend Live]

    D2 --> F2[Build React App]
    F2 --> G2[Deploy to Vercel CDN]
    G2 --> J2[Frontend Live]

    E1 --> F3[Build Preview]
    F3 --> G3[Preview URL Generated]

    J1 --> K[Full Stack Deployed]
    J2 --> K

    style A fill:#e1f5e1
    style K fill:#e1f5e1
    style J1 fill:#e1f0ff
    style J2 fill:#e1f0ff
```

**Typical Development Workflow:**

**1. Local Development:**
```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev

# Make changes, test locally
```

**2. Create Feature Branch:**
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

**3. Automatic Preview Deployment:**
- Vercel automatically creates preview deployment
- Test at: `https://roompilot-git-feature-new-feature.vercel.app`
- Backend still points to production Cloud Run

**4. Create Pull Request:**
- Open PR on GitHub
- Review code changes
- Test preview deployment
- Run automated tests

**5. Merge to Main:**
```bash
# After PR approval
git checkout main
git pull origin main
```

**6. Automatic Production Deployment:**
- **Backend:** GitHub Actions automatically deploys to Cloud Run (~3-5 min)
- **Frontend:** Vercel automatically deploys to production (~2 min)
- Both deploy in parallel!

**7. Verify Production:**
```bash
# Test backend
curl https://helloworld-api-xyz.run.app/api/messages

# Visit frontend
open https://helloworld-frontend.vercel.app
```

**Complete CI/CD Features:**

| Feature | Backend (Cloud Run) | Frontend (Vercel) |
|---------|-------------------|------------------|
| Auto-deploy on push to main | ✅ via GitHub Actions | ✅ Native integration |
| Preview deployments | ❌ (manual setup needed) | ✅ Automatic for PRs |
| Rollback support | ✅ Cloud Run revisions | ✅ Deployment history |
| Environment variables | ✅ GitHub Secrets | ✅ Vercel dashboard |
| Build logs | ✅ GitHub Actions | ✅ Vercel dashboard |
| Custom domains | ✅ Cloud Run | ✅ Vercel |
| SSL certificates | ✅ Automatic | ✅ Automatic |
| Database migrations | ✅ Flyway on deploy | N/A |

**Deployment Time:**
- **Backend:** ~3-5 minutes (Docker build + deploy)
- **Frontend:** ~2 minutes (npm build + CDN deploy)
- **Total:** ~5 minutes from push to live

### 9.5 Post-Deployment Verification

**Complete System Test:**

```bash
# 1. Test Database Connection
# (From Neon dashboard SQL Editor)
SELECT * FROM messages;

# 2. Test Backend API
BACKEND_URL="https://helloworld-api-xyz123-uc.a.run.app"
curl $BACKEND_URL/actuator/health
curl $BACKEND_URL/api/messages

# 3. Test Frontend
# Visit: https://helloworld-frontend.vercel.app
# Verify:
# - Page loads without errors
# - Messages are displayed
# - No CORS errors in console
# - Network tab shows successful API calls

# 4. Test CORS
# Check browser console network tab
# Verify response headers include:
# - Access-Control-Allow-Origin: https://helloworld-frontend.vercel.app
# - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

**Monitoring Setup:**

**Cloud Run Monitoring:**
```bash
# View logs
gcloud run services logs read helloworld-api \
  --region us-central1 \
  --limit 50

# View metrics in Cloud Console
# Navigate to: Cloud Run > helloworld-api > Metrics
```

**Vercel Monitoring:**
- Dashboard > Project > Analytics
- Real-time function logs
- Performance insights
- Error tracking

**Neon Monitoring:**
- Dashboard > Project > Monitoring
- Query performance
- Connection pool status
- Storage usage

### 9.5 Cost Estimates

**Neon Postgres (Free Tier):**
- Storage: 0.5 GB included
- Compute: 100 hours/month
- Cost: $0/month (sufficient for Hello World)

**Google Cloud Run:**
- First 2 million requests/month: Free
- 360,000 GB-seconds memory: Free
- Expected cost: $0/month for low traffic

**Vercel (Hobby Tier):**
- Bandwidth: 100 GB/month
- Builds: Unlimited
- Deployments: Unlimited
- Cost: $0/month

**Total Monthly Cost: $0** (within free tiers)

## 10. Implementation Checklist for Claude Code

### Phase 1: Project Initialization
- [ ] Create project root directory structure
- [ ] Initialize backend Maven/Gradle project
- [ ] Initialize frontend Vite React project
- [ ] Create .gitignore files (root, backend, frontend)
- [ ] Create .env.local template in project root
- [ ] Create logs/ directory in project root
- [ ] Create development scripts (Mac/Linux):
  - [ ] setup-dev.sh (one-time setup)
  - [ ] start-dev.sh (start both services)
  - [ ] stop-dev.sh (stop all services)
  - [ ] backend/dev.sh (backend helper)
- [ ] Create development scripts (Windows):
  - [ ] start-dev.ps1 (start both services)
  - [ ] stop-dev.ps1 (stop all services)
- [ ] Make all .sh scripts executable (chmod +x)
- [ ] Initialize Git repository

### Phase 2: Database Setup
- [ ] Document Neon account creation steps
- [ ] Document connection string format
- [ ] Note: Schema and seed data handled by Flyway migrations (see Phase 3)

### Phase 3: Backend Implementation
- [ ] Create Spring Boot application class
- [ ] Create Message entity with JPA annotations
- [ ] Create MessageRepository interface
- [ ] Create MessageService class
- [ ] Create MessageController with REST endpoints
- [ ] Configure CORS settings
- [ ] Configure application.properties with Flyway settings
- [ ] Create Flyway migration V1__create_messages_table.sql
- [ ] Create Flyway migration V2__insert_seed_data.sql
- [ ] Verify Flyway migrations directory structure
- [ ] Create Dockerfile
- [ ] Create .dockerignore
- [ ] Add health check endpoint
- [ ] Add Flyway health check endpoint
- [ ] Write basic unit tests

### Phase 4: Frontend Implementation
- [ ] Create React app structure
- [ ] Create API service module
- [ ] Create configuration for environment variables
- [ ] Create MessageList component
- [ ] Create MessageCard component (optional)
- [ ] Create main App component
- [ ] Add CSS styling
- [ ] Create .env.local and .env.production
- [ ] Configure Vite proxy if needed
- [ ] Test local development

### Phase 5: Local Testing
- [ ] Test backend health endpoint
- [ ] Test Flyway migrations applied successfully
- [ ] Verify flyway_schema_history table exists
- [ ] Test backend messages endpoint
- [ ] Test database connectivity
- [ ] Verify seed data inserted by Flyway
- [ ] Test frontend API integration
- [ ] Test CORS configuration
- [ ] Verify error handling
- [ ] Test responsive design

### Phase 6: Backend Deployment
- [ ] Create Google Cloud project
- [ ] Enable required APIs
- [ ] Build Docker image
- [ ] Push to Google Container Registry
- [ ] Deploy to Cloud Run
- [ ] Configure environment variables
- [ ] Test deployed API endpoints
- [ ] Verify database connectivity from Cloud Run
- [ ] Verify Flyway migrations ran on Cloud Run
- [ ] Configure custom domain (optional)

### Phase 7: Frontend Deployment
- [ ] Create Vercel account
- [ ] Sign in with GitHub to Vercel
- [ ] Import repository from GitHub
- [ ] Configure project settings (root directory: frontend)
- [ ] Set production environment variables (VITE_API_URL)
- [ ] Deploy to Vercel
- [ ] Verify deployment
- [ ] Test production API integration
- [ ] Configure custom domain (optional)

### Phase 8: Setup CI/CD (Continuous Deployment)
- [ ] Create Google Cloud service account for GitHub Actions
- [ ] Grant necessary IAM permissions to service account
- [ ] Download service account JSON key
- [ ] Add GitHub repository secrets (GCP_SA_KEY, DATABASE_URL, etc.)
- [ ] Create .github/workflows/deploy-backend.yml
- [ ] Create .github/workflows/test-backend.yml (optional)
- [ ] Commit and push workflow files
- [ ] Verify GitHub Actions runs successfully
- [ ] Test automatic backend deployment (push to main)
- [ ] Verify Vercel GitHub integration is active
- [ ] Test automatic frontend deployment (push to main)
- [ ] Test PR preview deployments on Vercel
- [ ] Document deployment URLs and monitoring links

### Phase 9: Final Verification
- [ ] End-to-end testing of deployed application
- [ ] Verify CORS in production
- [ ] Check all API endpoints
- [ ] Verify error handling in production
- [ ] Test performance and load times
- [ ] Review Cloud Run logs
- [ ] Review Vercel logs
- [ ] Verify CI/CD pipelines working
- [ ] Test rollback procedures
- [ ] Document any issues or warnings

### Phase 10: Documentation
- [ ] Create backend README.md
- [ ] Create frontend README.md
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Document API endpoints
- [ ] Add architecture diagrams to README

## 11. Testing Requirements

### Backend Tests

**Unit Tests:**
```java
@SpringBootTest
class MessageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getAllMessages_ShouldReturnMessages() throws Exception {
        mockMvc.perform(get("/api/messages"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].content").exists());
    }

    @Test
    void getMessageById_ShouldReturnMessage() throws Exception {
        mockMvc.perform(get("/api/messages/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.content").exists());
    }

    @Test
    void healthCheck_ShouldReturnUp() throws Exception {
        mockMvc.perform(get("/actuator/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"));
    }
}
```

**Integration Tests:**
- Database connectivity test
- Repository CRUD operations test
- Service layer tests

### Frontend Tests (Optional)

**Component Tests with React Testing Library:**
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { messageService } from './services/api';

jest.mock('./services/api');

test('renders messages from API', async () => {
  messageService.getAllMessages.mockResolvedValue({
    data: [
      { id: 1, content: 'Hello World', createdAt: new Date() }
    ]
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Manual Testing Checklist

**Local Environment:**
- [ ] Backend starts without errors
- [ ] Database migrations run successfully
- [ ] Frontend connects to backend
- [ ] Messages display correctly
- [ ] No console errors

**Production Environment:**
- [ ] API endpoints accessible via HTTPS
- [ ] CORS configured correctly
- [ ] Frontend loads on Vercel
- [ ] Data fetches from Neon database
- [ ] Performance is acceptable (< 2s page load)

## 12. Troubleshooting Guide

### Common Issues

**Issue 1: Database Connection Failed**
```
Error: FATAL: password authentication failed for user
```
**Solution:**
- Verify DATABASE_URL is correct
- Check Neon connection string includes password
- Ensure IP allowlist includes Cloud Run (if configured)
- Verify database is active in Neon dashboard

**Issue 2: CORS Error in Browser**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Solution:**
- Add Vercel URL to CORS allowed origins in Spring Boot
- Redeploy backend to Cloud Run
- Clear browser cache
- Verify CORS configuration in CorsConfig.java

**Issue 3: Cloud Run Cold Start Timeout**
```
Error: Container failed to start. Failed to start and then listen on the port
```
**Solution:**
- Increase Cloud Run timeout to 300s
- Optimize Spring Boot startup time
- Consider keeping min-instances to 1 for critical apps
- Check Cloud Run logs for specific errors

**Issue 4: Vercel Build Failed**
```
Error: Build exceeded maximum duration
```
**Solution:**
- Check for dependency installation issues
- Verify package.json scripts are correct
- Check Vercel build logs for specific error
- Ensure .env variables are set correctly

**Issue 5: 404 Not Found on API Calls**
```
GET /api/messages 404 Not Found
```
**Solution:**
- Verify backend is deployed and running
- Check Cloud Run service URL is correct in .env.production
- Test API endpoint directly with curl
- Verify VITE_API_URL environment variable in Vercel

**Issue 6: Flyway Migration Failed**
```
FlywayException: Validate failed: Migration checksum mismatch
```
**Solution:**
- Never modify a migration file after it has been applied
- Check flyway_schema_history table to see applied migrations
- For development, you can run `flyway clean` (DANGER: deletes all data)
- For production, create a new migration to fix the issue
- Verify migration files are in correct location: `src/main/resources/db/migration/`

**Issue 7: Table Already Exists Error**
```
PSQLException: ERROR: relation "messages" already exists
```
**Solution:**
- If you manually created tables before adding Flyway, either:
  - Option 1: Drop all tables and let Flyway recreate them
  - Option 2: Set `spring.flyway.baseline-on-migrate=true` (already configured)
- Verify `spring.jpa.hibernate.ddl-auto=validate` (not `create` or `update`)
- Check if Flyway baseline was run correctly

**Issue 8: No Seed Data in Database**
```
Messages table is empty despite Flyway migration V2
```
**Solution:**
- Check flyway_schema_history table: `SELECT * FROM flyway_schema_history;`
- Verify V2 migration status is "Success"
- Check application logs for Flyway migration output
- Ensure V2__insert_seed_data.sql is in correct directory
- Verify file naming follows Flyway convention (double underscore)

**How to Verify Flyway Migrations:**
```bash
# Check Flyway status endpoint
curl http://localhost:8080/actuator/flyway

# Connect to Neon and check migration history
psql $DATABASE_URL -c "SELECT * FROM flyway_schema_history ORDER BY installed_rank;"

# Check application logs for Flyway output
# Look for: "Migrating schema to version X - description"
```

## 13. Security Considerations

### Backend Security
- [ ] Use HTTPS only (Cloud Run provides automatically)
- [ ] Validate all inputs
- [ ] Use prepared statements (JPA handles this)
- [ ] Set appropriate CORS origins (not wildcard in production)
- [ ] Use environment variables for secrets
- [ ] Enable Cloud Run authentication if needed
- [ ] Implement rate limiting for production

### Frontend Security
- [ ] Sanitize user inputs
- [ ] Use HTTPS for all API calls
- [ ] Don't expose sensitive data in client code
- [ ] Implement Content Security Policy headers
- [ ] Use Vercel's built-in DDoS protection

### Database Security
- [ ] Use strong passwords
- [ ] Enable SSL for database connections (Neon default)
- [ ] Restrict database access to backend only
- [ ] Regular backups (Neon handles automatically)
- [ ] Monitor for unusual query patterns

## 14. Performance Optimization

### Backend Optimizations
- [ ] Enable response compression in Spring Boot
- [ ] Implement database connection pooling
- [ ] Add caching for frequently accessed data (Redis)
- [ ] Optimize JPA queries with proper indexing
- [ ] Use Cloud Run auto-scaling

### Frontend Optimizations
- [ ] Minimize bundle size
- [ ] Lazy load components
- [ ] Implement code splitting
- [ ] Use Vercel's CDN and edge caching
- [ ] Optimize images
- [ ] Enable Gzip/Brotli compression

### Database Optimizations
- [ ] Add indexes on frequently queried columns
- [ ] Use Neon's connection pooling
- [ ] Optimize query patterns
- [ ] Monitor slow queries

## 15. Next Steps After Hello World

Once this application is working, you can extend it:

**Feature Additions:**
1. User authentication (JWT tokens)
2. Create, Update, Delete messages (full CRUD)
3. Real-time updates with WebSockets
4. File uploads to Google Cloud Storage
5. Search and pagination
6. Rate limiting and caching

**Database Schema Evolution with Flyway:**
When adding new features, create new Flyway migrations:
- `V3__add_user_authentication.sql` - Add users table
- `V4__add_message_likes.sql` - Add likes functionality
- `V5__add_audit_columns.sql` - Add tracking columns
- Flyway will automatically apply new migrations on deployment

**Infrastructure Improvements:**
1. Add monitoring with Cloud Logging
2. Implement CI/CD pipeline
3. Add automated testing
4. Set up staging environment
5. Implement blue-green deployments

**Architecture Enhancements:**
1. Add Redis for caching
2. Implement message queue (Cloud Pub/Sub)
3. Add API Gateway (Cloud Endpoints)
4. Implement microservices pattern
5. Add GraphQL API

## 16. Support and Resources

### Documentation Links
- **Spring Boot:** https://spring.io/guides
- **React + Vite:** https://vitejs.dev/guide/
- **Neon Postgres:** https://neon.tech/docs/introduction
- **Google Cloud Run:** https://cloud.google.com/run/docs
- **Vercel:** https://vercel.com/docs

### Community Support
- Spring Boot Discord: https://discord.gg/spring
- React Discord: https://discord.gg/react
- Neon Community: https://neon.tech/community

### Cost Calculators
- Google Cloud Pricing: https://cloud.google.com/products/calculator
- Vercel Pricing: https://vercel.com/pricing
- Neon Pricing: https://neon.tech/pricing

---

## Quick Reference: CI/CD Setup

### Local Development Quick Start

**Option 1: Automated (Recommended)**
```bash
# 1. Clone repository
git clone <repo-url>
cd roompilot

# 2. One-time setup (installs dependencies, checks prereqs)
./setup-dev.sh

# 3. Edit .env.local with your Neon database URL
nano .env.local  # or vim, code, etc.

# 4. Start everything (runs in background)
./start-dev.sh
# ✅ Backend:  http://localhost:8080
# ✅ Frontend: http://localhost:5173

# 5. View logs
tail -f logs/backend.log
tail -f logs/frontend.log

# 6. Stop everything
./stop-dev.sh
```

**Option 2: Manual (Separate Terminals)**
```bash
# Terminal 1: Backend
cd backend
export DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname"
./mvnw spring-boot:run
# Runs on http://localhost:8080

# Terminal 2: Frontend
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8080" > .env.local
npm run dev
# Runs on http://localhost:5173
```

### CI/CD Quick Setup

**One-Time Setup:**

```bash
# 1. Google Cloud - Create service account
gcloud iam service-accounts create github-actions-deployer \
  --project=helloworld-backend-001

# 2. Grant permissions (run all 4 commands from section 9.2)

# 3. Download key
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=github-actions-deployer@helloworld-backend-001.iam.gserviceaccount.com

# 4. Add to GitHub Secrets (via GitHub UI):
#    - GCP_PROJECT_ID
#    - GCP_SA_KEY (contents of gcp-key.json)
#    - DATABASE_URL
#    - GCP_REGION
#    - SERVICE_NAME

# 5. Create workflow files (copy from section 9.2):
#    - .github/workflows/deploy-backend.yml
#    - .github/workflows/test-backend.yml

# 6. Vercel - Connect GitHub
#    - Visit vercel.com
#    - Sign in with GitHub
#    - Import repository
#    - Set VITE_API_URL environment variable
#    - Deploy!
```

**Daily Workflow:**

```bash
# 1. Make changes locally
git checkout -b feature/my-feature
# Edit files...

# 2. Test locally
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev

# 3. Push to GitHub
git add .
git commit -m "Add feature"
git push origin feature/my-feature

# 4. Vercel auto-creates preview deployment
# Visit: https://roompilot-git-feature-my-feature.vercel.app

# 5. Create PR, review, merge to main

# 6. Automatic production deployment! 🚀
#    Backend: https://helloworld-api-xyz.run.app (3-5 min)
#    Frontend: https://helloworld-frontend.vercel.app (2 min)
```

### Monitoring & Debugging

```bash
# View GitHub Actions
https://github.com/your-username/roompilot/actions

# View Cloud Run logs
gcloud run services logs read helloworld-api --region=us-central1

# View Cloud Run metrics
https://console.cloud.google.com/run/detail/us-central1/helloworld-api

# View Vercel deployments
https://vercel.com/dashboard

# Check Flyway migrations
curl https://your-api.run.app/actuator/flyway

# Test production backend
curl https://your-api.run.app/api/messages

# Test production frontend
open https://your-app.vercel.app
```

### Rollback Procedures

```bash
# Rollback Cloud Run (Backend)
gcloud run revisions list --service=helloworld-api --region=us-central1
gcloud run services update-traffic helloworld-api \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1

# Rollback Vercel (Frontend)
# Via dashboard: Deployments → Previous deployment → Promote to Production

# Rollback via Git (Both)
git revert <commit-sha>
git push origin main
# Both services auto-deploy the reverted code
```

### Key URLs to Bookmark

| Service | URL | Purpose |
|---------|-----|---------|
| GitHub Actions | `github.com/user/repo/actions` | View CI/CD builds |
| Cloud Run Console | `console.cloud.google.com/run` | Monitor backend |
| Vercel Dashboard | `vercel.com/dashboard` | Monitor frontend |
| Neon Dashboard | `console.neon.tech` | Database management |
| Production Backend | `your-api.run.app` | Live backend API |
| Production Frontend | `your-app.vercel.app` | Live frontend |

---

## Summary

This specification provides everything needed to build and deploy a production-ready "Hello World" full-stack application using:
- **Backend:** Java Spring Boot deployed to Google Cloud Run
- **Frontend:** React deployed to Vercel
- **Database:** Neon Postgres (serverless)
- **Migrations:** Flyway for database version control

The application demonstrates:
- Complete REST API implementation
- Database integration and persistence with Flyway migrations
- Proper database schema version control
- Frontend-backend communication
- Production deployment to cloud platforms
- Best practices for project structure
- Security and performance considerations

**Estimated Implementation Time:**
- Backend: 2-3 hours
- Frontend: 1-2 hours
- Deployment: 1-2 hours
- **Total: 4-7 hours** (including learning curve)

**Result:**
A working, deployed, production-ready application accessible via:
- Frontend: `https://helloworld-frontend.vercel.app`
- Backend API: `https://helloworld-api-[id].run.app`

This serves as a foundation for building more complex features for the RoomPilot platform.
