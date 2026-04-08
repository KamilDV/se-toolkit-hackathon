@echo off
setlocal enabledelayedexpansion

set SSH_KEY=C:\Users\kamil\.ssh\dudikov
set REMOTE_USER=dudikov
set REMOTE_HOST=158.160.253.198
set REMOTE_PATH=/home/dudikov/ai-flashcards
set PROJECT_DIR=c:\Users\kamil\Documents\0_SET_Hackathon

echo.
echo ========================================
echo   AI Flashcards - Deployment
echo ========================================
echo.

REM Step 1: Create remote directory
echo [1/6] Creating remote directory...
ssh -i "%SSH_KEY%" %REMOTE_USER%@%REMOTE_HOST% "mkdir -p %REMOTE_PATH%"
if errorlevel 1 (echo ERROR: Failed to create directory & pause & exit /b 1)

REM Step 2: Create subdirectories
echo [2/6] Creating subdirectories...
ssh -i "%SSH_KEY%" %REMOTE_USER%@%REMOTE_HOST% "mkdir -p %REMOTE_PATH%/backend %REMOTE_PATH%/frontend"

REM Step 3: Upload files
echo [3/6] Uploading backend files...
scp -i "%SSH_KEY%" -r "%PROJECT_DIR%\backend" %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PATH%/
if errorlevel 1 (echo ERROR: Backend upload failed & pause & exit /b 1)

echo [4/6] Uploading frontend files...
scp -i "%SSH_KEY%" -r "%PROJECT_DIR%\frontend" %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PATH%/
if errorlevel 1 (echo ERROR: Frontend upload failed & pause & exit /b 1)

echo       Uploading docker-compose.yml...
scp -i "%SSH_KEY%" "%PROJECT_DIR%\docker-compose.yml" %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PATH%/

REM Step 4: Create .env on server
echo [5/6] Creating .env on server...
ssh -i "%SSH_KEY%" %REMOTE_USER%@%REMOTE_HOST% "cat > %REMOTE_PATH%/.env << 'ENVEOF'
OPENAI_API_KEY=your-api-key-here
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_secure_2026
POSTGRES_SERVER=postgres
POSTGRES_PORT=5432
POSTGRES_DB=flashcards
SECRET_KEY=super-secret-key-change-in-production-make-it-long
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_MODEL=qwen-plus
ENVEOF"

REM Step 5: Build and deploy
echo [6/6] Building and deploying...
ssh -i "%SSH_KEY%" %REMOTE_USER%@%REMOTE_HOST% "cd %REMOTE_PATH% && docker compose down 2>/dev/null; docker compose up --build -d"

echo.
echo ========================================
echo   Deployment complete!
echo ========================================
echo.
echo   Frontend:  http://%REMOTE_HOST%
echo   Backend:   http://%REMOTE_HOST%:8000
echo   API Docs:  http://%REMOTE_HOST%:8000/docs
echo.

pause
