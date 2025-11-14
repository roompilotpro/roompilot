#!/bin/bash

# RoomPilot Backend Deployment Script
# Builds and deploys the backend to Google Cloud Run

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="roompilot-001"
REGION="us-central1"
SERVICE_NAME="roompilot-api"
ARTIFACT_REGISTRY_REPO="roompilot-repo"
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPO}/${SERVICE_NAME}"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}RoomPilot Backend Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
echo -e "${BLUE}Current GCP Project:${NC} ${CURRENT_PROJECT}"
echo ""

# Step 1: Build and push Docker image
echo -e "${YELLOW}Step 1/3: Building Docker image...${NC}"
echo "Building: ${IMAGE_NAME}"
echo ""

gcloud builds submit --tag "${IMAGE_NAME}" --project "${PROJECT_ID}"

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Build completed successfully${NC}"
echo ""

# Step 2: Deploy to Cloud Run
echo -e "${YELLOW}Step 2/3: Deploying to Cloud Run...${NC}"
echo "Service: ${SERVICE_NAME}"
echo "Region: ${REGION}"
echo ""

gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_NAME}:latest" \
    --platform managed \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --allow-unauthenticated

if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Deployment completed successfully${NC}"
echo ""

# Step 3: Get service URL and verify
echo -e "${YELLOW}Step 3/3: Verifying deployment...${NC}"

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --project "${PROJECT_ID}" \
    --format 'value(status.url)')

echo "Service URL: ${SERVICE_URL}"
echo ""

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "${SERVICE_URL}/actuator/health" || echo "FAILED")

if [[ $HEALTH_RESPONSE == *"UP"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "Response: ${HEALTH_RESPONSE}"
fi

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${BLUE}Service URL:${NC} ${SERVICE_URL}"
echo -e "${BLUE}Swagger UI:${NC} ${SERVICE_URL}/swagger-ui/index.html"
echo -e "${BLUE}Health Check:${NC} ${SERVICE_URL}/actuator/health"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update Vercel environment variable VITE_API_URL to: ${SERVICE_URL}"
echo "2. Redeploy frontend from Vercel dashboard"
echo ""
