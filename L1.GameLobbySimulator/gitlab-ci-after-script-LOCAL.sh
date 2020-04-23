#!/bin/sh

git fetch
HEADHASH=$(git rev-parse HEAD)
UPSTREAMHASH=$(git rev-parse LOCAL@{upstream})
if [ "$HEADHASH" != "$UPSTREAMHASH" ]; then
  git checkout -- .
  echo "Pull git"
  git pull
  echo "NPM Install"
  npm i
  echo "Build"
  npm run build
  echo "Restart service"
  sudo systemctl restart l1-game-lobby-simulator.service
fi