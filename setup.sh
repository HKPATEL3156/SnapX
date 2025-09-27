#!/bin/bash

echo "🚀 Starting SnapX - Image Gallery Platform"
echo ""

echo "📦 Installing dependencies..."
echo ""

echo "Installing frontend dependencies..."
npm install

echo ""
echo "Installing backend dependencies..."
cd server
npm install
cd ..

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

echo "🎯 To start the application:"
echo "1. Start backend: cd server && npm run dev"
echo "2. Start frontend: npm run dev"
echo "3. Open browser to: http://localhost:5173"
echo ""

echo "👑 Admin Login:"
echo "Email: admin@snapx.com"
echo "Password: admin@snapx001"
echo ""