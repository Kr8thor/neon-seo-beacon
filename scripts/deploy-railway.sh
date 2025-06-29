#!/bin/bash

# Railway Deployment Script for Neon SEO Beacon
# Usage: ./scripts/deploy-railway.sh

set -e

echo "🚀 Starting Railway deployment for Neon SEO Beacon..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed${NC}"
    echo -e "${BLUE}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

# Verify Railway login
echo -e "${BLUE}🔐 Checking Railway authentication...${NC}"
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Railway${NC}"
    echo -e "${BLUE}Please login to Railway:${NC}"
    railway login
fi

# Pre-deployment checks
echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check if required files exist
required_files=("railway.json" "package.json" ".env.production")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Required file missing: $file${NC}"
        exit 1
    fi
done

# Run linting and type checking
echo -e "${BLUE}🧹 Running code quality checks...${NC}"
npm run lint || {
    echo -e "${RED}❌ Linting failed. Please fix errors before deploying.${NC}"
    exit 1
}

npm run type-check || {
    echo -e "${RED}❌ Type checking failed. Please fix errors before deploying.${NC}"
    exit 1
}

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
npm run test:unit || {
    echo -e "${RED}❌ Tests failed. Please fix failing tests before deploying.${NC}"
    exit 1
}

# Build the application locally to verify
echo -e "${BLUE}🔨 Testing build process...${NC}"
npm run build || {
    echo -e "${RED}❌ Build failed. Please fix build errors before deploying.${NC}"
    exit 1
}

# Initialize Railway project if not already done
if [ ! -f "railway.toml" ] && [ ! -d ".railway" ]; then
    echo -e "${BLUE}🚂 Initializing Railway project...${NC}"
    railway init
fi

# Set environment variables
echo -e "${BLUE}⚙️  Setting up environment variables...${NC}"

# Read from .env.production and set variables
if [ -f ".env.production" ]; then
    echo -e "${YELLOW}📋 Setting environment variables from .env.production...${NC}"
    
    # Parse .env.production file and set variables
    while IFS= read -r line; do
        # Skip comments and empty lines
        if [[ $line =~ ^[[:space:]]*# ]] || [[ -z "${line// }" ]]; then
            continue
        fi
        
        # Extract key=value pairs
        if [[ $line =~ ^([^=]+)=(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            
            # Skip template comments
            if [[ $value != *"your_"* ]] && [[ $value != *"REQUIRED"* ]] && [[ -n "$value" ]]; then
                echo -e "${BLUE}Setting $key${NC}"
                railway variables set "$key=$value" || echo -e "${YELLOW}⚠️ Failed to set $key${NC}"
            fi
        fi
    done < .env.production
fi

# Deploy to Railway
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
railway up --detach

# Wait for deployment
echo -e "${BLUE}⏳ Waiting for deployment to complete...${NC}"
sleep 30

# Get deployment URL
deployment_url=$(railway status --json | jq -r '.project.deployments[0].url' 2>/dev/null || echo "")

if [ -z "$deployment_url" ] || [ "$deployment_url" = "null" ]; then
    echo -e "${YELLOW}⚠️ Could not retrieve deployment URL automatically${NC}"
    echo -e "${BLUE}You can find your deployment URL in the Railway dashboard${NC}"
else
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application URL: $deployment_url${NC}"
    
    # Test the deployment
    echo -e "${BLUE}🔍 Testing deployment...${NC}"
    
    # Test health endpoint
    health_url="$deployment_url/api/health"
    if curl -s "$health_url" | grep -q "healthy"; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️ Health check failed - application may still be starting${NC}"
    fi
fi

# Domain setup instructions
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "${YELLOW}1. Set up custom domain (audit.mardenseo.com) in Railway dashboard${NC}"
echo -e "${YELLOW}2. Update DNS records:${NC}"
echo -e "   ${BLUE}Type: CNAME${NC}"
echo -e "   ${BLUE}Name: audit${NC}"
echo -e "   ${BLUE}Value: your-project.up.railway.app${NC}"
echo -e "${YELLOW}3. Railway will automatically provision SSL certificate${NC}"

echo -e "${GREEN}🎉 Railway deployment completed!${NC}"