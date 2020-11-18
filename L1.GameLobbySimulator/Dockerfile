# Base image
FROM git3.nexdev.net:5050/lumi-ops/docker-images/node:14.10-slim

USER root

ENV NODE_ENV $NODE_ENV
RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

COPY package.json package-lock.json* ./

RUN npm install --loglevel verbose && npm cache clean --force
ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/src
COPY ./src .

RUN webpack

CMD [ "node", "./app.js" ]