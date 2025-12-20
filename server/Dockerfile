FROM node:16

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 5000

RUN npm run build

ENV NODE_ENV production

CMD ["npm", "start"]