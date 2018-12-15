FROM node:10

RUN npm config set registry https://registry.npm.taobao.org

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json /home/node/app
RUN npm install

COPY . /home/node/app

EXPOSE 8000

ENV NODE_ENV production

RUN yarn build && yarn cache clean

CMD node service/index.js
