#!/bin/bash

set -e

# Configuration
SSH_KEY="C:\Users\kamil\.ssh\dudikov"
REMOTE_USER="dudikov"
REMOTE_HOST="158.160.253.198"
REMOTE_PATH="/home/dudikov/ai-flashcards"
PROJECT_DIR="c:\Users\kamil\Documents\0_SET_Hackathon"

echo "🚀 AI Flashcards - Deployment"
echo "==============================="

# Step 1: Create remote directory
echo "📁 Creating remote directory..."
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}"

# Step 2: Sync files via rsync (or scp)
echo "📦 Uploading files to server..."

# Upload docker-compose.yml
scp -i "$SSH_KEY" "${PROJECT_DIR}/docker-compose.yml" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

# Upload backend files
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}/backend"
scp -i "$SSH_KEY" -r "${PROJECT_DIR}/backend/"* "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/backend/"

# Upload frontend files
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ${REMOTE_PATH}/frontend"
scp -i "$SSH_KEY" -r "${PROJECT_DIR}/frontend/"* "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/frontend/"

# Step 3: Create .env file on server
echo "⚙️  Creating .env file..."
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "cat > ${REMOTE_PATH}/.env << 'EOF'
OPENAI_API_KEY=${OPENAI_API_KEY}
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_secure_password_2026
POSTGRES_SERVER=postgres
POSTGRES_PORT=5432
POSTGRES_DB=flashcards
SECRET_KEY=production-secret-key-change-this-to-something-random-and-long
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_MODEL=qwen-plus
EOF"

# Step 4: Build and start containers
echo "🐳 Building and starting containers..."
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "cd ${REMOTE_PATH} && docker compose down || true && docker compose up --build -d"

# Step 5: Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Step 6: Check status
echo "✅ Deployment complete!"
echo ""
ssh -i "$SSH_KEY" "${REMOTE_USER}@${REMOTE_HOST}" "cd ${REMOTE_PATH} && docker compose ps"
echo ""
echo "🌐 Frontend: http://${REMOTE_HOST}"
echo "🔧 Backend API: http://${REMOTE_HOST}:8000"
echo "📖 API Docs: http://${REMOTE_HOST}:8000/docs"
