FROM node:10-alpine

USER root

RUN npm config set registry http://registry.cnpmjs.org && npm config set unsafe-perm true

RUN npm install -g cnpm

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN cnpm install

COPY . /home/node/app

EXPOSE 8080

ENV NODE_ENV production

RUN yarn build && yarn cache clean

CMD yarn start
