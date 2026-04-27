FROM node:22-alpine
RUN apk update && apk upgrade
WORKDIR /app
COPY package.json .
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY . .
COPY tools/prisma-entrypoint.sh /prisma-entrypoint.sh
RUN chmod +x /prisma-entrypoint.sh
EXPOSE 3000
CMD ["sh", "/prisma-entrypoint.sh"]