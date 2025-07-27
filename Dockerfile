FROM node:20-alpine
WORKDIR /opt/aigerus-backend
COPY package.json .
COPY package-lock.json .
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]