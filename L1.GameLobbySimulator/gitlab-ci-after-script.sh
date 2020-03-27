#!/bin/sh

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
BASE=$(git merge-base @ "$UPSTREAM")
PULL=$(git pull)
INSTALL=$(npm i)
BUILD=$(npm build:sit)
RESTART_SERVICE=$(echo 'restart service')

if [ $LOCAL = $BASE ]; then
  $PULL
  $INSTALL
  $BUILD
  $RESTART_SERVICE
fi