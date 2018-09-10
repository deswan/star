FROM node:10

ENV NODE_ENV production

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN yarn --production=false

COPY . /home/node/app

RUN yarn build && yarn cache clean

CMD yarn start && node service/index.js
