#!/bin/bash
set -e

echo "=========================================="
echo "  Docker Installation & Deployment"
echo "=========================================="

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[1/4] Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
fi

# Verify docker compose
echo "[2/4] Checking docker compose..."
docker compose version

# Navigate to project
cd /home/dudikov/ai-flashcards

# Verify .env
echo "[3/4] Checking .env..."
if [ -f .env ]; then
    echo ".env file found"
else
    echo "ERROR: .env file not found!"
    exit 1
fi

# Build and deploy
echo "[4/4] Building and deploying..."
docker compose down 2>/dev/null || true
docker compose up --build -d

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo ""
docker compose ps
echo ""
echo "Frontend:  http://158.160.253.198"
echo "Backend:   http://158.160.253.198:8000"
echo "API Docs:  http://158.160.253.198:8000/docs"
