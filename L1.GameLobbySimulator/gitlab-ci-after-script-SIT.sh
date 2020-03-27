#!/bin/sh

git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse master@{upstream})
if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
  echo "Pull git"
  git pull
  echo "NPM Install"
  npm i
  echo "Build"
  npm run build:sit
  echo "Restart service"
  sudo systemctl restart l1-game-lobby-simulator-sit.service
fi