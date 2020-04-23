#!/bin/sh

git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse SIT@{upstream})
if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
  git checkout -- .
  echo "Pull git"
  git pull
  echo "NPM Install"
  npm i
  echo "Build"
  npm run build:sit
  echo "Restart service"
  sudo systemctl restart l2-game-lobby-simulator-sit.service
fi