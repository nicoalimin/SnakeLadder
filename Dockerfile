FROM node:14.15.1-alpine3.10

WORKDIR /app

RUN rm -rf node_modules/
RUN npm install --silent
RUN npm rebuild node-sass

COPY . /app

CMD ["npm", "start"]