FROM node:22-alpine
RUN apk update && apk upgrade
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 5173
CMD ["sh", "/entrypoint.sh"]