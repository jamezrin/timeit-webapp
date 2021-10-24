#!/usr/bin/env bash

echo "=== Current migration status:"
yarn workspace backend typeorm migration:show

if [ -n "$TIMEIT_RUN_MIGRATIONS" ]; then
  echo "=== Running typeorm migrations..."
  yarn workspace backend typeorm migration:run
fi

echo "=== Starting the server..."
node /app/packages/backend/build/index.js
