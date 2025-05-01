#!/bin/bash

# Austin Trail Runner Demo Script
# This script helps run the demo application

echo "=== Austin Trail Runner Demo ==="
echo "This script will help you run the demo application"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo "Checking dependencies..."
if ! command_exists python3; then
  echo "Error: Python 3 is required but not installed"
  exit 1
fi

if ! command_exists npm; then
  echo "Error: npm is required but not installed"
  exit 1
fi

# Setup backend
echo -e "\n=== Setting up backend ==="
cd backend
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Setup frontend
echo -e "\n=== Setting up frontend ==="
cd ../frontend
echo "Installing npm dependencies..."
npm install

# Run tests to demonstrate failing test
echo -e "\n=== Running tests (with deliberate failing test) ==="
cd ../backend
python -m pytest tests/test_utils.py -v

# Provide instructions for running the application
echo -e "\n=== Demo Instructions ==="
echo "To run the backend server:"
echo "  cd backend && python app.py"
echo ""
echo "To run the frontend server (in a separate terminal):"
echo "  cd frontend && npm start"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "=== Demo Scenarios ==="
echo "1. View the failing test and fix it using Cascade"
echo "2. Add a new feature to the application"
echo "3. Demonstrate terminal commands and browser preview"
echo ""
echo "Demo setup complete!"
