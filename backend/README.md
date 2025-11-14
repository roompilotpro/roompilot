# Hello World Backend API

Spring Boot REST API with PostgreSQL database and Flyway migrations.

## Tech Stack
- Java 17+
- Spring Boot 3.2.0
- PostgreSQL (Neon)
- Flyway for database migrations
- Maven

## Prerequisites
- Java 17 or higher
- Maven (or use included `./mvnw`)
- Docker (for local PostgreSQL)

## Quick Start

### 1. Database Setup
The project uses PostgreSQL via Docker locally:
```bash
# Start PostgreSQL (from project root)
docker-compose up -d postgres

# Database connection is configured in .env.local:
DATABASE_URL=postgresql://roompilot:roompilot123@localhost:5432/roompilot
```

### 2. Build
```bash
./mvnw clean install
```

### 3. Run

**Option 1: Using convenience script (from project root)**
```bash
cd ..
./start-backend.sh
# Runs in foreground, press Ctrl+C to stop
```

**Option 2: Using Maven directly**
```bash
./mvnw spring-boot:run
# Runs in foreground, press Ctrl+C to stop
```

API will be available at `http://localhost:8080`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /actuator/health | Health check |
| GET | /api/messages | Get all messages |
| GET | /api/messages/{id} | Get message by ID |
| POST | /api/messages | Create new message |
| PUT | /api/messages/{id} | Update message |
| DELETE | /api/messages/{id} | Delete message |

## Database Migrations
Flyway migrations are located in `src/main/resources/db/migration/`:
- V1__create_messages_table.sql
- V2__insert_seed_data.sql

Migrations run automatically on application startup.

## Docker
```bash
docker build -t roompilot-api .
docker run -p 8080:8080 -e DATABASE_URL=$DATABASE_URL roompilot-api
```

## Testing
```bash
./mvnw test
```

## Deployment to Production

### Deploy to Google Cloud Run

Use the automated deployment script:

```bash
./deploy.sh
```

This script will:
1. Build the Docker image using Google Cloud Build
2. Push to Artifact Registry
3. Deploy to Cloud Run
4. Verify the deployment with a health check

**Requirements:**
- `gcloud` CLI installed and authenticated
- Access to `roompilot-001` GCP project

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build and push Docker image
gcloud builds submit --tag us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api

# Deploy to Cloud Run
gcloud run deploy roompilot-api \
  --image us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**After Deployment:**
1. Update Vercel environment variable `VITE_API_URL` with the new service URL
2. Redeploy the frontend from Vercel dashboard

### API Documentation

Swagger UI is available at:
- Local: `http://localhost:8080/swagger-ui/index.html`
- Production: `https://your-service-url/swagger-ui/index.html`

## Project Structure
```
backend/
├── src/main/java/com/roompilot/roompilot/
│   ├── config/         # Configuration classes
│   ├── controller/     # REST controllers
│   ├── model/         # Entity models
│   ├── repository/    # Data repositories
│   └── service/       # Business logic
└── src/main/resources/
    ├── db/migration/  # Flyway migrations
    └── application.properties
```