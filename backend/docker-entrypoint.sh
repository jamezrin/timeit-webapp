#!/usr/bin/env bash

if [ -n "$TIMEIT_RUN_MIGRATIONS" ]; then
  echo "=== Running typeorm migrations..."
  yarn run typeorm migration:run
fi

echo "=== Starting the server..."
node /app/build/index.js
