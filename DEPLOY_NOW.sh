#!/bin/bash

# Sidekick Quick Deploy Script
# Run this after Vercel limit resets

set -e

echo "🚀 Sidekick Deployment Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Run this script from the SideKick root directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Deploy Web Dashboard${NC}"
echo "──────────────────────────────────"
echo "Opening Vercel..."
echo ""
echo "Go to: https://vercel.com/new"
echo ""
echo "Configuration:"
echo "  • Framework: Next.js"
echo "  • Root Directory: web"
echo "  • Build Command: npm run build"
echo ""
echo "Add these environment variables:"
echo ""
cat << 'EOF'
DATABASE_URL=postgresql://postgres:soorajk1234567892@db.uphayungnrbpgxpqjuyl.supabase.co:5432/postgres
NEXTAUTH_SECRET=OeVapwm5Iyg58Ch7Cr4hdh7vOfgO0+Wa09R7GByrkz4=
NEXTAUTH_URL=https://YOUR-URL.vercel.app
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
NEXT_PUBLIC_APP_URL=https://YOUR-URL.vercel.app
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
echo ""
read -p "Press Enter when web dashboard is deployed..."

echo ""
echo -e "${YELLOW}Step 2: Setup Database${NC}"
echo "──────────────────────────────────"
echo "Running database migrations..."
cd web
npm install
npm run db:push

echo ""
echo -e "${GREEN}✅ Database tables created!${NC}"
echo ""

read -p "Do you want to add default templates? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding default templates..."
    echo "1. Go to: https://supabase.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to SQL Editor"
    echo "4. Copy and paste: database-default-templates.sql"
    echo "5. Click Run"
    echo ""
    echo "Opening file for you..."
    cat ../database-default-templates.sql
    echo ""
    read -p "Press Enter when templates are added..."
fi

cd ..

echo ""
echo -e "${YELLOW}Step 3: Test Deployment${NC}"
echo "──────────────────────────────────"
echo "Go to your deployed URL and:"
echo "  1. Sign up for account"
echo "  2. Create a template"
echo "  3. View dashboard"
echo ""
read -p "Press Enter when tested..."

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "  • Deploy backend (optional): vercel --cwd backend"
echo "  • Configure Zoom webhooks"
echo "  • Launch to beta users!"
echo ""
echo "See LAUNCH_CHECKLIST.md for full guide"
echo ""
