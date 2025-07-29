FROM node:20-alpine

WORKDIR /opt/aigerus-backend

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]