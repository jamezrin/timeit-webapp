#!/usr/bin/env bash

echo "=== Current migration status:"
npx typeorm migration:show

if [ -n "$TIMEIT_RUN_MIGRATIONS" ]; then
  echo "=== Running typeorm migrations..."
  npx typeorm migration:run
fi

echo "=== Starting the server..."
npm run start
