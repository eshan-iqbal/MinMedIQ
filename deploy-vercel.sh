#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Clear Vercel cache
echo "🧹 Clearing Vercel cache..."
vercel --force

# Deploy to production
echo "📦 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your app should now be available at:"
echo "   https://your-app-name.vercel.app"
echo ""
echo "📝 If you're still experiencing issues:"
echo "   1. Clear your browser cache"
echo "   2. Try accessing the app in an incognito window"
echo "   3. Check the Vercel deployment logs"
echo "   4. Ensure all environment variables are set in Vercel dashboard" 