FROM node:14-alpine

RUN apk add curl

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY . /app/

EXPOSE 8080
CMD ["npm", "run", "serve"]