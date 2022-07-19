FROM node:16.2.0 as base

WORKDIR /app

COPY package.json .

COPY yarn.lock .

FROM base as dependencies

RUN yarn install --prod

RUN cp -R node_modules prod_node_modules

RUN yarn install

FROM dependencies as build

COPY . .

RUN yarn build

FROM base as main

COPY pm2.json ./pm2.json

COPY scripts/ ./scripts

COPY --from=dependencies /app/prod_node_modules ./node_modules

COPY --from=build /app/dist ./dist

RUN yarn global add pm2

EXPOSE 5000

RUN chmod +x scripts/*
