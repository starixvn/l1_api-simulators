# Base image
FROM node:14-alpine3.10

# ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

USER root
WORKDIR /opt/node_app/app
COPY ./src .
RUN npm install && npm cache clean --force
ENV PATH /opt/node_app/app/node_modules/.bin:$PATH

RUN webpack

CMD [ "node", "./app.js" ]