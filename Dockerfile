FROM node:8
WORKDIR /usr/src/app/client
COPY client/package*.json .
copy yarn.lock .
RUN yarn install
WORKDIR /usr/src/app
COPY package*.json ./
copy yarn.lock .
RUN yarn install
COPY . .
WORKDIR /usr/src/app/client
RUN yarn build
WORKDIR /usr/src/app
expose 5000
CMD ["yarn","start"]