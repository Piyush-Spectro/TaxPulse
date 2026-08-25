#!/bin/bash

# TaxPulse GitHub Pages Deployment Helper Script

echo "================================================="
echo "  TaxPulse - GitHub Pages Deployment Setup  "
echo "================================================="
echo ""

# Navigate to project directory
CDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$CDIR"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "1. Initializing local Git repository..."
    git init
    git branch -M main
else
    echo "1. Git repository already initialized."
fi

# Add all files
echo "2. Staging project files..."
git add .

# Commit
echo "3. Committing changes..."
git commit -m "Deploy TaxPulse Product Management Capstone project"

echo ""
echo "-------------------------------------------------"
echo "Git setup completed locally!"
echo "-------------------------------------------------"
echo ""
echo "To publish your project live on GitHub Pages:"
echo ""
echo "Step A: Create a repository on GitHub (e.g., named 'taxpulse-capstone')"
echo "Step B: Run the following commands in your terminal:"
echo ""
echo "  git remote add origin https://github.com/<YOUR-USERNAME>/taxpulse-capstone.git"
echo "  git push -u origin main"
echo ""
echo "Step C: Go to your GitHub repository -> Settings -> Pages"
echo "        Set Source to 'main' branch / (root)."
echo ""
echo "Your live URL will be: https://<YOUR-USERNAME>.github.io/taxpulse-capstone/"
echo "================================================="
