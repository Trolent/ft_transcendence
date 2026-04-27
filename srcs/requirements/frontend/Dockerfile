FROM node:22-alpine
RUN apk update && apk upgrade
WORKDIR /app
COPY package.json package-lock.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]