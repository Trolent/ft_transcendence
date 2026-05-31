#!/bin/sh
set -e

if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "prod" ]; then
  npm run build
  npm run preview -- --host --port 5173
else
  npm run dev
fi
