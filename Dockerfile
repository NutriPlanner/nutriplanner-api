FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

ARG MONGODB_URL
ARG JWT_SECRET
ARG SMTP_CLIENT_ID
ARG SMTP_CLIENT_SECRET
ARG SMTP_REFRESH_TOKEN
ARG SMTP_USERNAME

ENV MONGODB_URL=$MONGODB_URL
ENV JWT_SECRET=$JWT_SECRET
ENV SMTP_CLIENT_ID=$SMTP_CLIENT_ID
ENV SMTP_CLIENT_SECRET=$SMTP_CLIENT_SECRET
ENV SMTP_REFRESH_TOKEN=$SMTP_REFRESH_TOKEN
ENV SMTP_USERNAME=$SMTP_USERNAME

ENV HOST 0.0.0.0
EXPOSE 80

CMD [ "yarn", "start" ]
