FROM node:10

ENV NODE_ENV production

ARG API_SERVICE_HOST

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN yarn --production=false

COPY . /home/node/app

EXPOSE 8080

RUN yarn build && yarn cache clean

CMD yarn start
