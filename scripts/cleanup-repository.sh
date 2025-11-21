#!/bin/bash

# Repository Cleanup Script for Neon SEO Beacon
# This script removes React/Vite artifacts and fixes CI/CD conflicts

echo "🧹 Starting Repository Cleanup..."
echo "Removing React/Vite artifacts to fix CI/CD pipeline..."

# Remove React source directory
if [ -d "src" ]; then
    echo "🗑️  Removing React src/ directory..."
    rm -rf src/
    echo "✅ Removed src/ directory"
else
    echo "ℹ️  src/ directory not found"
fi

# Remove Vite entry point
if [ -f "index.html" ]; then
    echo "🗑️  Removing Vite index.html..."
    rm index.html
    echo "✅ Removed index.html"
else
    echo "ℹ️  index.html not found"
fi

# Remove Vite configuration
if [ -f "vite.config.ts" ]; then
    echo "🗑️  Removing vite.config.ts..."
    rm vite.config.ts
    echo "✅ Removed vite.config.ts"
else
    echo "ℹ️  vite.config.ts not found"
fi

# Remove Vite-specific TypeScript configs
if [ -f "tsconfig.app.json" ]; then
    echo "🗑️  Removing tsconfig.app.json..."
    rm tsconfig.app.json
    echo "✅ Removed tsconfig.app.json"
else
    echo "ℹ️  tsconfig.app.json not found"
fi

if [ -f "tsconfig.node.json" ]; then
    echo "🗑️  Removing tsconfig.node.json..."
    rm tsconfig.node.json
    echo "✅ Removed tsconfig.node.json"
else
    echo "ℹ️  tsconfig.node.json not found"
fi

# Clean up duplicate Tailwind configs (keep the .ts version)
if [ -f "tailwind.config.js" ] && [ -f "tailwind.config.ts" ]; then
    echo "🗑️  Removing duplicate tailwind.config.js (keeping .ts version)..."
    rm tailwind.config.js
    echo "✅ Removed duplicate tailwind.config.js"
fi

echo ""
echo "🎉 Cleanup completed!"
echo ""
echo "📋 Summary of removed files:"
echo "   • src/ directory (React application)"
echo "   • index.html (Vite entry point)"
echo "   • vite.config.ts (Vite configuration)"
echo "   • tsconfig.app.json (Vite TypeScript config)"
echo "   • tsconfig.node.json (Vite TypeScript config)"
echo "   • tailwind.config.js (duplicate file)"
echo ""
echo "✅ Your repository now has a clean Nuxt 3 architecture!"
echo "✅ GitHub Actions should now pass successfully!"
echo ""
echo "🚀 Next steps:"
echo "   1. Commit and push these changes"
echo "   2. Run 'npm install' to update dependencies"
echo "   3. Run 'npm run test:ci' to verify all tests pass"
echo "   4. Deploy to production"
