#!/bin/bash
# One-line installer for SSH Profile Switcher

set -e

echo "📦 Installing SSH Profile Switcher..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✓ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install

echo ""
echo "🔧 Installing globally..."
npm install -g .

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 You can now use the command: sshswitch"
echo ""

