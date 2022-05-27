FROM node:10-alpine

RUN apk add curl

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY . /app/

EXPOSE 3000
CMD ["npm", "run", "start:dev"]