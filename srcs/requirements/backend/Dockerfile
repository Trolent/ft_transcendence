FROM node:22-alpine
RUN apk update && apk upgrade
WORKDIR /app
COPY package.json .
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate
COPY . .
COPY tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
CMD ["sh", "/entrypoint.sh"]