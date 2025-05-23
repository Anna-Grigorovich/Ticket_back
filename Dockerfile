FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY src/ src/
COPY resources/ resources/

RUN npm run build

FROM node:lts-alpine

WORKDIR /app
LABEL com.centurylinklabs.watchtower.enable="true"

COPY package*.json ./
RUN npm install

COPY --from=build /app/dist ./dist/
COPY --from=build /app/resources ./resources/

EXPOSE 3300
CMD ["node", "dist/main.js"]
