#!/bin/bash

# Setup script for Cruise Recruitment System
# This script helps set up the development environment

set -e

echo "🚢 Cruise Recruitment System - Setup Script"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
# Database
POSTGRES_DB=cruise_recruitment
POSTGRES_USER=cruise_user
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32)

# Elasticsearch
ELASTIC_PASSWORD=$(openssl rand -base64 32)

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=$(openssl rand -base64 32)

# JWT Secret
JWT_SECRET=$(openssl rand -base64 64)

# API URL
API_URL=http://localhost/api
EOF
    echo -e "${GREEN}.env file created successfully!${NC}"
else
    echo -e "${GREEN}.env file already exists.${NC}"
fi

# Create service .env files if needed
for service in api web-public web-admin web-candidate; do
    if [ ! -f "services/$service/.env" ]; then
        echo -e "${YELLOW}Creating .env for $service...${NC}"
        touch "services/$service/.env"
    fi
done

# Create necessary directories
echo -e "${YELLOW}Creating necessary directories...${NC}"
mkdir -p infrastructure/nginx/ssl
mkdir -p logs

# Set permissions
chmod +x scripts/*.sh 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Review and update .env file with your configuration"
echo "2. Run: docker-compose up -d"
echo "3. Access the services at:"
echo "   - Public Portal: http://localhost/"
echo "   - Admin Dashboard: http://localhost/admin"
echo "   - Candidate Portal: http://localhost/candidate"
echo "   - API: http://localhost/api"
echo ""

