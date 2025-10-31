#!/bin/bash

# SideKick Deployment Test Script
# Tests your deployed backend and frontend

echo "🧪 SideKick Deployment Test"
echo "==========================="
echo ""

# Get URLs from user
read -p "Enter your backend URL (e.g., https://sidekick.up.railway.app): " BACKEND_URL
read -p "Enter your frontend URL (e.g., https://sidekick.vercel.app): " FRONTEND_URL

echo ""
echo "Testing backend: $BACKEND_URL"
echo "Testing frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health
echo "1️⃣  Testing backend health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend health check passed"
    echo "   Response: $BODY"
else
    echo "   ❌ Backend health check failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 2: Templates API
echo "2️⃣  Testing templates API..."
TEMPLATES_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/templates")
HTTP_CODE=$(echo "$TEMPLATES_RESPONSE" | tail -n1)
BODY=$(echo "$TEMPLATES_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    TEMPLATE_COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l)
    echo "   ✅ Templates API working"
    echo "   Found $TEMPLATE_COUNT templates"

    if [ "$TEMPLATE_COUNT" -ge 5 ]; then
        echo "   ✅ All default templates present"
    else
        echo "   ⚠️  Expected 5 templates, found $TEMPLATE_COUNT"
        echo "   Run: npm run db:seed"
    fi
else
    echo "   ❌ Templates API failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
fi
echo ""

# Test 3: Frontend Accessibility
echo "3️⃣  Testing frontend accessibility..."
FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL")
HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Frontend is accessible"
else
    echo "   ❌ Frontend check failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test 4: CORS Check
echo "4️⃣  Testing CORS configuration..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/templates" \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: GET")

if echo "$CORS_RESPONSE" | grep -q "access-control-allow-origin"; then
    echo "   ✅ CORS is configured"
else
    echo "   ⚠️  CORS headers not found"
    echo "   Make sure FRONTEND_URL is set in backend environment"
fi
echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo "Backend URL:  $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Next steps:"
echo "1. If all tests passed ✅ - Configure Zoom app URLs"
echo "2. If tests failed ❌ - Check backend logs and environment variables"
echo ""
echo "Zoom Configuration URLs:"
echo "  Home URL:     $FRONTEND_URL"
echo "  Webhook URL:  $BACKEND_URL/api/webhooks/zoom"
echo "  Redirect URL: $FRONTEND_URL/auth/zoom/callback"
