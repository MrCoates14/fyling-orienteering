#!/bin/bash

# Fyling Hall Orienteering App - Setup Script
# Run this on your server to install the app

echo "🏕️  Fyling Hall Orienteering App - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js first:"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  Mac: brew install node"
    echo "  Windows: Download from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app, run:"
echo "  npm start"
echo ""
echo "Then access:"
echo "  Student app: http://localhost:3000"
echo "  Teacher dashboard: http://localhost:3000/teacher.html"
echo ""
