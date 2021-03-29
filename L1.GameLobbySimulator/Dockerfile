# Base image
FROM git3.nexdev.net:5050/lumi-ops/docker-images/node:14.10-slim

USER root

ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --loglevel verbose && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app/src
COPY ./src .

RUN webpack

CMD [ "node", "./app.js" ]
