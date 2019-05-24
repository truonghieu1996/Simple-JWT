FROM debian/node:latest

WORKDIR /usr/src/app
COPY dist /usr/src/app

ENV NODE_ENV=production

ENV APP_PORT_HTTP=80

ENV APP_DB_HOST=app-db
ENV APP_DB_PORT=3306
ENV APP_DB_NAME=pcnlicense
ENV APP_DB_USER=root
ENV APP_DB_PWD=123456

EXPOSE 80
CMD [ "npm", "start" ]
