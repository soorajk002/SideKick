#!/bin/bash

# Sidekick Web Dashboard Setup Script
# This script sets up the web dashboard for local development

set -e

echo "🚀 Setting up Sidekick Web Dashboard..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Navigate to web directory
cd "$(dirname "$0")/web"

# Step 1: Check if .env exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file already exists. Backing up to .env.backup${NC}"
    cp .env .env.backup
fi

# Step 2: Generate NextAuth secret
echo "🔑 Generating NextAuth secret..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Step 3: Create .env file
echo "📝 Creating .env file with basic configuration..."
cat > .env << EOF
# Database - YOU NEED TO UPDATE THIS
# Get free database from: https://supabase.com
DATABASE_URL=postgresql://postgres:password@localhost:5432/sidekick

# NextAuth.js - Auto-generated
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# OpenAI - REQUIRED FOR AI FEATURES
# Get your key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-openai-api-key-here

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8080

# OAuth Providers (Optional - can use email/password first)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
ZOOM_WEBHOOK_SECRET=

# Stripe (Optional - not fully implemented)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Optional - not implemented)
RESEND_API_KEY=
FROM_EMAIL=noreply@yourdomain.com
EOF

echo -e "${GREEN}✅ .env file created${NC}"
echo ""

# Step 4: Display next steps
echo -e "${YELLOW}⚠️  IMPORTANT: You need to configure these environment variables:${NC}"
echo ""
echo "1. DATABASE_URL - Get free PostgreSQL from Supabase:"
echo "   👉 https://supabase.com (sign up → create project → copy connection string)"
echo ""
echo "2. OPENAI_API_KEY - Required for AI auto-checking:"
echo "   👉 https://platform.openai.com/api-keys"
echo ""
echo -e "${YELLOW}Edit the .env file and add your values:${NC}"
echo "   nano .env"
echo ""

# Step 5: Ask if user wants to continue
read -p "Have you updated DATABASE_URL and OPENAI_API_KEY in .env? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "No problem! Here's what to do:"
    echo ""
    echo "1. Get a free database from Supabase:"
    echo "   - Go to https://supabase.com"
    echo "   - Create account and new project"
    echo "   - Go to Settings → Database → Connection string"
    echo "   - Copy the URI and paste into .env as DATABASE_URL"
    echo ""
    echo "2. Get OpenAI API key (optional, for AI features):"
    echo "   - Go to https://platform.openai.com/api-keys"
    echo "   - Create new secret key"
    echo "   - Copy and paste into .env as OPENAI_API_KEY"
    echo ""
    echo "3. Edit .env file:"
    echo "   nano web/.env"
    echo ""
    echo "4. Run this script again:"
    echo "   ./setup-web-dashboard.sh"
    echo ""
    exit 0
fi

# Step 6: Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Step 7: Setup database
echo ""
echo "🗄️  Setting up database schema..."
echo "Running: npm run db:push"
npm run db:push || {
    echo -e "${RED}❌ Database setup failed. Please check your DATABASE_URL${NC}"
    echo ""
    echo "Common issues:"
    echo "- Database URL is incorrect"
    echo "- Database server is not accessible"
    echo "- Firewall blocking connection"
    echo ""
    echo "You can skip this and try manually later with:"
    echo "  cd web && npm run db:push"
    echo ""
}

# Step 8: All done
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "To start the development server:"
echo "  cd web"
echo "  npm run dev"
echo ""
echo "Then open your browser to:"
echo "  👉 http://localhost:3001"
echo ""
echo "You can now:"
echo "  ✅ Sign up for an account"
echo "  ✅ Create sales templates"
echo "  ✅ View analytics dashboard"
echo "  ✅ Manage team members"
echo ""
echo "To test the Zoom app:"
echo "  1. Install app in Zoom Marketplace (development mode)"
echo "  2. Join a Zoom meeting"
echo "  3. Open Sidekick from the Apps sidebar"
echo ""
