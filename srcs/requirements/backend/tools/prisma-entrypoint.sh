#!/bin/sh

npx prisma generate
npx prisma migrate deploy

if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "prod" ]; then
  npm run start:prod
else
  npm run start:dev
fi
