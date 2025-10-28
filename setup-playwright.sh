#!/bin/bash

echo "============================================"
echo "  Playwright Testing Setup"
echo "============================================"
echo ""

# Check if Playwright is installed
if [ ! -d "node_modules/@playwright" ]; then
  echo "❌ Playwright is not installed."
  echo "Please run: npm install"
  exit 1
fi

echo "✅ Playwright is installed"
echo ""

# Check if browsers are installed
if [ ! -d "node_modules/.cache/ms-playwright" ]; then
  echo "⚠️  Browser binaries are not installed."
  echo ""
  echo "Installing browser binaries now..."
  npx playwright install
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Browser binaries installed successfully!"
  else
    echo ""
    echo "❌ Failed to install browser binaries"
    exit 1
  fi
else
  echo "✅ Browser binaries are already installed"
fi

echo ""
echo "============================================"
echo "  Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Start your development server on http://localhost:3000"
echo "  2. Run tests with: npm test"
echo "  3. View tests documentation: cat tests/README.md"
echo ""


