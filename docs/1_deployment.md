# RoomPilot Deployment Guide

This guide provides step-by-step instructions for deploying the RoomPilot application to production.

> **Note:** This guide uses **Artifact Registry** (not the deprecated Container Registry). Google Container Registry (gcr.io) is being shut down - use Artifact Registry (pkg.dev) instead.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deploy Backend to Google Cloud Run](#deploy-backend-to-google-cloud-run)
3. [Deploy Frontend to Vercel](#deploy-frontend-to-vercel)
4. [Setup CI/CD Pipeline](#setup-cicd-pipeline)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Neon database created with connection string
- ✅ Google Cloud account with billing enabled
- ✅ Vercel account (free tier available)
- ✅ GitHub repository with your code
- ✅ Local application tested and working
- ✅ `gcloud` CLI installed and authenticated
- ✅ Docker installed (for local testing, optional)

### Tools Installation

```bash
# Install gcloud CLI (Mac)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Install Vercel CLI (optional)
npm install -g vercel

# Verify installations
gcloud --version
vercel --version
```

---

## Deploy Backend to Google Cloud Run

### Step 1: Setup Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create new project (or use existing)
gcloud projects create roompilot-001 --name="RoomPilot"

# Set the project as active
gcloud config set project roompilot-001

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

**Create Artifact Registry Repository:**

```bash
# Create Docker repository in Artifact Registry
gcloud artifacts repositories create roompilot-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="RoomPilot Docker repository"

# Configure Docker to use Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev
```

### Step 2: Prepare Backend for Deployment

Verify your backend configuration:

**Check `backend/src/main/resources/application.properties`:**
```properties
# Application
spring.application.name=roompilot-api
server.port=8080

# Database - Uses environment variable
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver

# Flyway migrations
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration

# Actuator endpoints
management.endpoints.web.exposure.include=health,info,flyway
```

**Check `backend/Dockerfile` exists:**
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

### Step 3: Build and Deploy to Cloud Run

**Option A: Using Automated Script (Recommended)**

The easiest way to deploy is using the automated deployment script:

```bash
# Navigate to backend directory
cd backend

# Run the deployment script
./deploy.sh
```

This script will:
- Build the Docker image using Google Cloud Build
- Push to Artifact Registry
- Deploy to Cloud Run
- Verify the deployment with a health check
- Display the service URL and next steps

**Option B: Using Cloud Build Manually**

```bash
# Navigate to backend directory
cd backend

# Build and push using Cloud Build (no local Docker required)
gcloud builds submit --tag us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api

# This automatically:
# - Builds the Docker image in the cloud
# - Pushes to Artifact Registry
# - Usually takes 3-5 minutes
```

**Option C: Using Local Docker**

```bash
# Build locally
cd backend
docker build -t us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api .

# Push to Artifact Registry (Docker should already be configured from Step 1)
docker push us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api
```

### Step 4: Deploy to Cloud Run (if not using deploy.sh)

```bash
# Set your Neon database URL
export DATABASE_URL="jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require"

# Deploy the service
gcloud run deploy roompilot-api \
  --image us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="$DATABASE_URL" \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10

# Output will show your service URL:
# Service URL: https://roompilot-api-xyz123-uc.a.run.app
```

### Step 5: Verify Backend Deployment

```bash
# Get the service URL
export SERVICE_URL=$(gcloud run services describe roompilot-api \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)')

echo "Backend URL: $SERVICE_URL"

# Test health endpoint
curl $SERVICE_URL/actuator/health

# Expected output: {"status":"UP"}

# Test API endpoint
curl $SERVICE_URL/api/messages

# Should return JSON array with messages

# Check Flyway migrations
curl $SERVICE_URL/actuator/flyway
```

### Step 6: View Logs and Monitor

```bash
# View recent logs
gcloud run services logs read roompilot-api \
  --region us-central1 \
  --limit 50

# Follow logs in real-time
gcloud run services logs tail roompilot-api \
  --region us-central1

# View metrics in Cloud Console
# Visit: https://console.cloud.google.com/run
```

---

## Deploy Frontend to Vercel

### Step 1: Sign Up and Connect GitHub

1. Visit https://vercel.com
2. Click **"Sign Up"**
3. Select **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import RoomPilot Repository

1. From Vercel dashboard, click **"Add New Project"**
2. Select **"Import Git Repository"**
3. Find and select your `roompilot` repository
4. Click **"Import"**

### Step 3: Configure Project Settings

Vercel auto-detects Vite, but verify these settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4: Add Environment Variables

Before deploying, add your backend URL:

1. In the import screen, expand **"Environment Variables"**
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Cloud Run URL (e.g., `https://roompilot-api-xyz123-uc.a.run.app`)
   - **Environment:** Production (checked)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes for:
   - Dependencies to install
   - React app to build
   - Deployment to global CDN
3. You'll get a URL like: `https://roompilot.vercel.app`

### Step 6: Verify Frontend Deployment

1. Click **"Visit"** to open your deployed app
2. Verify:
   - Page loads without errors
   - Messages display from backend
   - No CORS errors in browser console (F12)
   - Network tab shows successful API calls

### Step 7: Update Backend CORS (Important!)

Your backend needs to allow requests from Vercel:

**Edit `backend/src/main/java/com/roompilot/controller/MessageController.java`:**

```java
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
    "https://roompilot.vercel.app"  // Add your Vercel URL
})
```

> **Note:** Spring's `@CrossOrigin` does not support wildcard patterns like `https://*.vercel.app`. You must add each URL explicitly. For preview deployments, consider implementing a custom CORS configuration.

Then redeploy backend using the deployment script:
```bash
cd backend
./deploy.sh
```

Or manually:
```bash
cd backend
gcloud builds submit --tag us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api
gcloud run deploy roompilot-api \
  --image us-central1-docker.pkg.dev/roompilot-001/roompilot-repo/roompilot-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Setup CI/CD Pipeline

Automate deployments so every push to `main` automatically deploys to production.

### Backend CI/CD with GitHub Actions

#### Step 1: Create Service Account

```bash
# Set variables
export PROJECT_ID="roompilot-001"
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
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

# Create and download service account key
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=$SA_EMAIL

# Display the key (you'll copy this to GitHub)
cat ~/gcp-key.json
```

#### Step 2: Add GitHub Secrets

Navigate to your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | `roompilot-001` |
| `GCP_SA_KEY` | Contents of `gcp-key.json` | Entire JSON file |
| `DATABASE_URL` | Your Neon connection string (JDBC format) | `jdbc:postgresql://host/db?user=username&password=password&sslmode=require` |
| `GCP_REGION` | Cloud Run region | `us-central1` |
| `SERVICE_NAME` | Cloud Run service name | `roompilot-api` |
| `ARTIFACT_REGISTRY_REPO` | Artifact Registry repository name | `roompilot-repo` |

> **Important:** Make sure `ARTIFACT_REGISTRY_REPO` contains only the repository name (`roompilot-repo`), not the full path. The workflow will construct the full path automatically.

**DATABASE_URL Format (Critical!):**

Neon provides connection strings in standard PostgreSQL format:
```
postgresql://user:password@host/database?params
```

However, Spring Boot requires **JDBC format** with credentials as query parameters:
```
jdbc:postgresql://host/database?user=username&password=password&sslmode=require&channel_binding=require
```

**Example transformation:**
- ❌ **Neon format (won't work):**
  ```
  postgresql://neondb_owner:npg_S7jDwyCFUn6i@ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?sslmode=require
  ```
- ✅ **JDBC format (correct):**
  ```
  jdbc:postgresql://ep-autumn-tree-a4hqcdbz-pooler.us-east-1.aws.neon.tech/roompilot-dev?user=neondb_owner&password=npg_S7jDwyCFUn6i&sslmode=require&channel_binding=require
  ```

**How to convert:**
1. Add `jdbc:` prefix
2. Remove `user:password@` from URL
3. Move credentials to query parameters: `?user=xxx&password=yyy`
4. Keep other parameters like `sslmode` and `channel_binding`

#### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/deploy-backend.yml`:

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
  AR_REPO: ${{ secrets.ARTIFACT_REGISTRY_REPO }}

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

    - name: Build and push Docker image using Cloud Build
      run: |
        cd backend
        # Submit build asynchronously to avoid log streaming issues
        BUILD_ID=$(gcloud builds submit \
          --tag $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE_NAME:${{ github.sha }} \
          --async \
          --format="value(id)")

        echo "Build ID: $BUILD_ID"
        echo "Waiting for build to complete..."

        # Poll for build completion
        for i in {1..60}; do
          STATUS=$(gcloud builds describe $BUILD_ID --format="value(status)")
          echo "Build status: $STATUS"

          if [ "$STATUS" = "SUCCESS" ]; then
            echo "Build completed successfully!"
            break
          elif [ "$STATUS" = "FAILURE" ] || [ "$STATUS" = "TIMEOUT" ] || [ "$STATUS" = "CANCELLED" ]; then
            echo "Build failed with status: $STATUS"
            echo "View logs at: https://console.cloud.google.com/cloud-build/builds/$BUILD_ID?project=$PROJECT_ID"
            exit 1
          fi

          sleep 10
        done

        if [ "$STATUS" != "SUCCESS" ]; then
          echo "Build timed out after 10 minutes"
          exit 1
        fi

        # Tag the image as latest
        gcloud artifacts docker tags add \
          $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE_NAME:${{ github.sha }} \
          $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE_NAME:latest

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy $SERVICE_NAME \
          --image $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE_NAME:${{ github.sha }} \
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

#### Step 4: Create Test Workflow (Optional)

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
        chmod +x mvnw
        ./mvnw test

    - name: Build application
      run: |
        cd backend
        ./mvnw clean package -DskipTests
```

#### Step 5: Commit and Push Workflows

```bash
# Add workflow files
git add .github/workflows/

# Commit
git commit -m "Add CI/CD workflows for backend"

# Push to main (triggers first deployment!)
git push origin main

# Watch progress in GitHub Actions
# Visit: https://github.com/your-username/roompilot/actions
```

### Frontend CI/CD with Vercel

Frontend CI/CD is automatically enabled when you connect Vercel to GitHub!

**What happens automatically:**

1. **Push to `main`** → Automatic production deployment
2. **Open PR** → Automatic preview deployment with unique URL
3. **Commit to PR** → Preview deployment updates

**Configure additional environments (Optional):**

Via Vercel Dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add different URLs for different environments:
   - **Production:** `VITE_API_URL=https://roompilot-api-prod.run.app`
   - **Preview:** `VITE_API_URL=https://roompilot-api-staging.run.app`
   - **Development:** `VITE_API_URL=http://localhost:8080`

---

## Post-Deployment Verification

### Complete System Test

```bash
# 1. Test Database (via Neon SQL Editor)
# Visit: https://console.neon.tech
# Run: SELECT * FROM messages;

# 2. Test Backend API
export BACKEND_URL="https://roompilot-api-xyz123-uc.a.run.app"

curl $BACKEND_URL/actuator/health
# Expected: {"status":"UP"}

curl $BACKEND_URL/api/messages
# Expected: JSON array with messages

curl $BACKEND_URL/actuator/flyway
# Verify migrations applied

# 3. Test Frontend
# Visit: https://roompilot.vercel.app
# Verify:
# - Page loads without errors
# - Messages display correctly
# - No CORS errors in browser console (F12)
# - Network tab shows successful API calls

# 4. Test CORS
# Open browser console → Network tab
# Verify response headers include:
# - Access-Control-Allow-Origin: https://roompilot.vercel.app
```

### Verification Checklist

- [ ] Backend health endpoint returns `{"status":"UP"}`
- [ ] Backend API returns messages from database
- [ ] Flyway migrations applied successfully
- [ ] Frontend loads on Vercel
- [ ] Frontend displays data from backend
- [ ] No CORS errors in browser console
- [ ] GitHub Actions workflows completed successfully
- [ ] Vercel auto-deployment working

---

## Monitoring & Maintenance

### View Logs

**Backend (Cloud Run):**
```bash
# View recent logs
gcloud run services logs read roompilot-api \
  --region us-central1 \
  --limit 50

# Follow logs in real-time
gcloud run services logs tail roompilot-api \
  --region us-central1

# Filter by severity
gcloud run services logs read roompilot-api \
  --region us-central1 \
  --log-filter="severity>=ERROR"
```

**Frontend (Vercel):**
- Dashboard → Your Project → Logs
- Real-time function logs
- Build logs for each deployment

**Database (Neon):**
- Dashboard → Your Project → Monitoring
- Query performance
- Connection pool status

### Monitor Metrics

**Cloud Run Metrics:**
- Visit: https://console.cloud.google.com/run/detail/us-central1/roompilot-api
- View:
  - Request count
  - Request latency
  - Container instances
  - CPU/Memory usage
  - Error rates

**Vercel Analytics:**
- Dashboard → Your Project → Analytics
- View:
  - Page views
  - Unique visitors
  - Performance metrics
  - Edge network status

### Rollback Procedures

**Rollback Backend:**
```bash
# List recent revisions
gcloud run revisions list \
  --service=roompilot-api \
  --region=us-central1

# Rollback to previous revision
gcloud run services update-traffic roompilot-api \
  --region=us-central1 \
  --to-revisions=PREVIOUS_REVISION_NAME=100
```

**Rollback Frontend:**
- Via Vercel Dashboard:
  1. Go to **Deployments**
  2. Find previous deployment
  3. Click **"Promote to Production"**

**Rollback via Git (Both services):**
```bash
# Revert problematic commit
git revert <commit-sha>
git push origin main

# Both services auto-deploy the reverted code
```

### Update Environment Variables

**Update Backend Env Vars:**
```bash
# Update single variable
gcloud run services update roompilot-api \
  --region us-central1 \
  --set-env-vars DATABASE_URL="new-connection-string"

# Or via Cloud Console:
# https://console.cloud.google.com/run/detail/us-central1/roompilot-api
```

**Update Frontend Env Vars:**
- Via Vercel Dashboard:
  1. Go to **Project Settings** → **Environment Variables**
  2. Edit `VITE_API_URL`
  3. Redeploy from **Deployments** tab

### Cost Monitoring

**Check Google Cloud Costs:**
```bash
# View billing
gcloud billing accounts list

# View project billing
gcloud beta billing projects describe roompilot-backend
```

**Monthly Cost Estimates:**
- **Neon:** $0 (free tier - 0.5GB storage, 100 compute hours)
- **Cloud Run:** $0-$10 (free tier covers 2M requests/month)
- **Vercel:** $0 (hobby tier - 100GB bandwidth)

**Set up Budget Alerts:**
1. Visit: https://console.cloud.google.com/billing/budgets
2. Create budget alert for $10/month threshold

---

## Troubleshooting

### Common Issues

**Issue: CORS Error in Browser**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Solution:**
1. Add Vercel URL to `@CrossOrigin` in backend controller
2. Redeploy backend
3. Clear browser cache

**Issue: Cloud Run Cold Start Timeout**
```
Container failed to start. Failed to listen on port
```
**Solution:**
- Check application.properties has `server.port=8080`
- Increase Cloud Run timeout: `--timeout=600` (default is 300s, Spring Boot apps need more time)
- Check logs for actual startup errors: `gcloud run services logs read roompilot-api`
- Common causes: Database connection failures, invalid DATABASE_URL format (see above)

**Issue: Flyway Migration Failed**
```
FlywayException: Validate failed: Migration checksum mismatch
```
**Solution:**
- Never modify migration files after they've been applied
- Check `flyway_schema_history` table in database
- Create new migration to fix issues

**Issue: Database Connection Failed**
```
PSQLException: FATAL: password authentication failed
```
**Solution:**
- Verify `DATABASE_URL` is correct in Cloud Run env vars
- Check Neon database is active
- Test connection locally first

**Issue: Invalid JDBC URL / Port Number Error**
```
WARN org.postgresql.util.PGPropertyUtil : JDBC URL invalid port number: npg_S7jDwyCFUn6i@ep-autumn-tree...
```
or
```
Driver org.postgresql.Driver claims to not accept jdbcUrl, jdbc:postgresql://user:password@host/db
```
**Cause:**
The `DATABASE_URL` is using standard PostgreSQL format (`user:password@host`) instead of JDBC format.

**Solution:**
Update your `DATABASE_URL` secret in GitHub Actions to use JDBC format with credentials as query parameters:

❌ **Wrong (Neon's default format):**
```
jdbc:postgresql://neondb_owner:password@ep-autumn-tree-xxx.neon.tech/db
```

✅ **Correct (JDBC format):**
```
jdbc:postgresql://ep-autumn-tree-xxx.neon.tech/db?user=neondb_owner&password=xxx&sslmode=require&channel_binding=require
```

Steps:
1. Go to GitHub repository **Settings** → **Secrets and variables** → **Actions**
2. Edit the `DATABASE_URL` secret
3. Convert to JDBC format (move credentials from URL to query parameters)
4. Re-run the failed deployment

**Issue: GitHub Actions - Permission Denied on Artifact Registry**
```
denied: Permission "artifactregistry.repositories.uploadArtifacts" denied
```
or
```
denied: Permission 'artifactregistry.tags.delete' denied
```
**Solution:**
The service account is missing the Artifact Registry Writer role. Add it with:
```bash
gcloud projects add-iam-policy-binding roompilot-001 \
  --member="serviceAccount:github-actions-deployer@roompilot-001.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"
```

The `roles/artifactregistry.writer` role includes:
- `artifactregistry.repositories.uploadArtifacts` - Upload Docker images
- `artifactregistry.tags.create` - Create tags
- `artifactregistry.tags.delete` - Delete/update tags (needed for "latest" tag)
- `artifactregistry.tags.update` - Update tag metadata

Also verify:
- All required roles from Step 1 of CI/CD setup are assigned
- `ARTIFACT_REGISTRY_REPO` secret contains only the repo name (`roompilot-repo`), not the full path
- Artifact Registry API is enabled: `gcloud services enable artifactregistry.googleapis.com`
- Workflow is using Artifact Registry (`pkg.dev`), not Container Registry (`gcr.io`)

**Issue: GitHub Actions - GCR Permission Denied**
```
denied: Permission denied on resource 'gcr.io/...'
```
**Solution:**
This means your workflow is incorrectly using Google Container Registry (deprecated) instead of Artifact Registry:
1. Update your `.github/workflows/deploy-backend.yml` to use `$REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/$SERVICE_NAME`
2. Change `gcloud auth configure-docker` to `gcloud auth configure-docker $REGION-docker.pkg.dev`
3. Ensure all image references use the Artifact Registry path

**Issue: GitHub Actions - Missing Secret**
```
Error: Input required and not supplied: credentials_json
```
**Solution:**
- Go to GitHub repository **Settings** → **Secrets and variables** → **Actions**
- Verify all required secrets are added (see Step 2 of CI/CD setup)
- Double-check secret names match exactly (case-sensitive)

**Issue: GitHub Actions - Cloud Build Log Streaming Error**
```
ERROR: (gcloud.builds.submit)
The build is running, and logs are being written to the default logs bucket.
This tool can only stream logs if you are Viewer/Owner of the project...
Error: Process completed with exit code 1.
```
**Context:**
The Cloud Build itself succeeds (visible in Cloud Console), but the GitHub Action fails because `gcloud builds submit` can't stream logs due to VPC-SC security policies or insufficient log viewer permissions.

**Solution:**
The workflow uses asynchronous builds with status polling instead of synchronous builds:
- Submits builds with `--async` flag (no log streaming needed)
- Polls build status every 10 seconds
- Checks for SUCCESS/FAILURE/TIMEOUT/CANCELLED states
- Provides Cloud Console link for debugging failures

This approach doesn't require log streaming permissions and reliably detects build outcomes. The workflow is already configured this way - no action needed unless you modified it.

---

## Daily Development Workflow

### With CI/CD (Recommended)

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
./start-dev.sh

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 4. Vercel automatically creates preview deployment
# Test at: https://roompilot-git-feature-new-feature.vercel.app

# 5. Create PR on GitHub
# Review code and test preview

# 6. Merge to main
# Both backend and frontend auto-deploy to production via GitHub Actions!

# 7. Verify production
curl https://roompilot-api-xyz.run.app/api/messages
open https://roompilot.vercel.app
```

### Manual Deployment (Alternative)

If you need to deploy manually without waiting for CI/CD:

```bash
# Deploy backend
cd backend
./deploy.sh

# The script handles everything:
# - Builds Docker image
# - Pushes to Artifact Registry
# - Deploys to Cloud Run
# - Verifies deployment

# Frontend deploys automatically on Vercel
# Or manually trigger from Vercel dashboard
```

---

## Key URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| **GitHub Actions** | `github.com/your-username/roompilot/actions` | View CI/CD builds |
| **Cloud Run Console** | `console.cloud.google.com/run` | Monitor backend |
| **Vercel Dashboard** | `vercel.com/dashboard` | Monitor frontend |
| **Neon Dashboard** | `console.neon.tech` | Database management |
| **Production Backend** | `https://roompilot-api-*.run.app` | Live backend API |
| **Production Frontend** | `https://roompilot.vercel.app` | Live frontend |
| **Swagger UI** | `https://roompilot-api-*.run.app/swagger-ui/index.html` | API documentation |

---

## Next Steps

After successful deployment:

1. **Setup Custom Domain** (Optional)
   - Configure domain in Vercel for frontend
   - Configure domain in Cloud Run for backend
   - Update CORS settings

2. **Enable Monitoring**
   - Setup Cloud Monitoring alerts
   - Enable Vercel Analytics
   - Configure error tracking

3. **Security Hardening**
   - Enable Cloud Armor for DDoS protection
   - Setup rate limiting
   - Review IAM permissions

4. **Performance Optimization**
   - Enable Cloud CDN
   - Configure caching strategies
   - Optimize database queries

---

## Support

For issues or questions:

- **Backend Issues:** Check Cloud Run logs
- **Frontend Issues:** Check Vercel deployment logs
- **Database Issues:** Check Neon dashboard
- **CI/CD Issues:** Check GitHub Actions logs

**Documentation:**
- Google Cloud Run: https://cloud.google.com/run/docs
- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs

---

**Deployment complete! 🚀**

Your RoomPilot application is now live:
- Backend: https://roompilot-api-*.run.app
- Frontend: https://roompilot.vercel.app
- Every push to `main` automatically deploys to production
