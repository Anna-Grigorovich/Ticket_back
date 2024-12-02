FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install
COPY src/ src/
RUN npm run build

FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=build /app/dist ./dist/

EXPOSE 3300
CMD ["node", "dist/main.js"]
