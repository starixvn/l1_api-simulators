FROM registry.nexdev.net:5050/docker/node:14.15.1-slim

USER root

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app/src
COPY ./src .

RUN webpack

CMD [ "node", "./app.js" ]
