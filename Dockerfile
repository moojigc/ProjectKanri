FROM node:18-alpine

# Create app directory
RUN mkdir -p /app/api && mkdir -p /app/client

COPY ./api/package*.json /app/api/
COPY ./client/package*.json /app/client/

RUN cd /app/api && npm install && \
    cd /app/client && npm install

COPY ./client /app/client

WORKDIR /app/client

RUN npm run build

WORKDIR /app

RUN rm -rf ./client/src && mv ./client/build ./api/client

COPY ./api /app/api

WORKDIR /app/api

EXPOSE 80

ENV NODE_ENV=production

CMD [ "npm", "start" ]
