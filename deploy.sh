#!/usr/bin/env bash
#
# Deploy whatnotery.com
#
#   1. Build the Jekyll site into ~/Desktop/whatnotery.com
#   2. Commit and push that build directory to GitHub
#   3. SSH to the server and git pull the latest build

set -euo pipefail

SOURCE_DIR="/Users/jos/Library/Mobile Documents/com~apple~CloudDocs/Code/whatnotery.com"
BUILD_DIR="$HOME/Desktop/whatnotery.com"
REMOTE_URL="https://github.com/whatnotery/whatnotery.com.git"
SSH_HOST="ssh.whatnotery.com"
REMOTE_DIR="~/MyShare/Serve/whatnotery.com/"

echo "==> Building Jekyll site..."
cd "$SOURCE_DIR"
jekyll build -d "$BUILD_DIR"

echo "==> Preparing deploy repo..."
cd "$BUILD_DIR"
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "    Initializing git repository..."
  git init -b main
fi
git branch -M main 2>/dev/null || true
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "    Adding origin remote..."
  git remote add origin "$REMOTE_URL"
fi

echo "==> Committing and pushing build..."
git add -A
if [ -z "$(git status --porcelain)" ]; then
  echo "    No changes to commit."
else
  git commit -m "deploy: rebuild site $(date '+%Y-%m-%d %H:%M:%S')"
fi
git push -u origin main

echo "==> Pulling latest build on the server..."
ssh "$SSH_HOST" "cd $REMOTE_DIR && git pull"

echo "==> Deploy complete."
