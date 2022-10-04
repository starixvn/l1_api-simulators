# Base image
FROM registry.nexdev.net:5050/docker/node:14.15.1-slim

USER root

ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn build

HEALTHCHECK --interval=10s CMD node src/healthcheck.js

CMD [ "node", "src/app.js" ]
