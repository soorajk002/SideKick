#!/bin/bash

# SideKick Database Setup Script
# This script initializes your database schema and seeds default templates

set -e  # Exit on any error

echo "🗄️  SideKick Database Setup"
echo "=========================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo ""
    echo "Please set it first:"
    echo "  export DATABASE_URL='your_database_connection_string'"
    echo ""
    echo "Examples:"
    echo "  Supabase: postgresql://postgres.xxx:password@db.xxx.supabase.co:6543/postgres"
    echo "  Railway:  postgresql://postgres:password@xxx.railway.app:5432/railway"
    echo "  Local:    postgresql://postgres:password@localhost:5432/sidekick"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Navigate to backend directory
cd backend || { echo "❌ Error: backend directory not found"; exit 1; }

echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "🔧 Pushing database schema..."
npm run db:push

echo ""
echo "🌱 Seeding default templates..."
npm run db:seed

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "✅ Created tables:"
echo "   - users"
echo "   - templates"
echo "   - checklists"
echo "   - transcriptions"
echo "   - checklist_matches"
echo ""
echo "✅ Added 5 default sales playbook templates:"
echo "   - Discovery Call"
echo "   - Product Demo"
echo "   - Closing Call"
echo "   - Follow-up Call"
echo "   - Qualification Call"
echo ""
echo "Next steps:"
echo "1. Verify in your database dashboard"
echo "2. Test backend: curl https://your-backend/api/templates"
echo "3. Configure Zoom app URLs"
