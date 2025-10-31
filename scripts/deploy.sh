#!/bin/bash

# SideKick Deployment Script for Vercel + Railway

echo "🚀 SideKick Deployment Helper"
echo "=============================="
echo ""

# Check if required commands are installed
command -v vercel >/dev/null 2>&1 || { echo "❌ Vercel CLI not installed. Run: npm install -g vercel"; exit 1; }

echo "✅ Vercel CLI found"
echo ""

# Step 1: Deploy Frontend
echo "📦 Step 1: Deploy Frontend to Vercel"
echo "------------------------------------"
read -p "Deploy frontend now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd frontend
    echo "Deploying frontend..."
    vercel --prod
    cd ..
    echo "✅ Frontend deployed!"
fi
echo ""

# Step 2: Deploy Backend
echo "📦 Step 2: Deploy Backend"
echo "-------------------------"
echo "Choose your backend deployment platform:"
echo "1) Vercel (serverless, limited WebSocket support)"
echo "2) Railway (recommended, better for real-time)"
echo "3) Skip backend deployment"
read -p "Enter choice (1-3): " backend_choice

case $backend_choice in
    1)
        echo "Deploying backend to Vercel..."
        cd backend
        vercel --prod
        cd ..
        echo "✅ Backend deployed to Vercel!"
        ;;
    2)
        echo "To deploy to Railway:"
        echo "1. Go to https://railway.app"
        echo "2. Create new project from GitHub"
        echo "3. Select the 'backend' folder"
        echo "4. Add environment variables"
        echo "5. Deploy will start automatically"
        read -p "Press enter when done..."
        ;;
    3)
        echo "Skipping backend deployment"
        ;;
esac
echo ""

# Step 3: Environment Variables Reminder
echo "⚙️  Step 3: Environment Variables"
echo "--------------------------------"
echo "Make sure you've set these environment variables:"
echo ""
echo "Frontend (Vercel):"
echo "  VITE_BACKEND_URL=https://your-backend-url"
echo ""
echo "Backend (Vercel/Railway):"
echo "  ZOOM_CLIENT_ID"
echo "  ZOOM_CLIENT_SECRET"
echo "  OPENAI_API_KEY"
echo "  DATABASE_URL"
echo "  (and all others from .env.production)"
echo ""
read -p "Press enter to continue..."
echo ""

# Step 4: Database Setup
echo "🗄️  Step 4: Database Setup"
echo "------------------------"
read -p "Have you set up your database? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Database setup options:"
    echo "1. Vercel Postgres (easy, integrated)"
    echo "2. Supabase (generous free tier)"
    echo "3. Railway Postgres (included with Railway)"
    echo ""
    echo "See docs/VERCEL_DEPLOYMENT.md for detailed instructions"
fi
echo ""

# Step 5: URLs Summary
echo "🔗 Step 5: Get Your Deployment URLs"
echo "-----------------------------------"
echo "After deployment, update these URLs:"
echo ""
echo "1. In Zoom App Settings:"
echo "   - Home URL: https://your-frontend.vercel.app"
echo "   - Webhook URL: https://your-backend.vercel.app/api/webhooks/zoom"
echo ""
echo "2. In Backend Environment Variables:"
echo "   - FRONTEND_URL: https://your-frontend.vercel.app"
echo "   - BACKEND_URL: https://your-backend.vercel.app"
echo ""
echo "3. In Frontend Environment Variables:"
echo "   - VITE_BACKEND_URL: https://your-backend.vercel.app"
echo ""

echo "✨ Deployment helper complete!"
echo "📚 See docs/VERCEL_DEPLOYMENT.md for full instructions"
