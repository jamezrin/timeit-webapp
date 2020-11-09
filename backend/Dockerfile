#
# Build stage
#

FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY src ./src

RUN yarn install --frozen-lockfile && yarn build

#
# Production stage
#

FROM node:12

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY --from=builder /usr/src/app/build ./build

RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_LOGGING=true
ENV TYPEORM_PORT=7000
ENV TYPEORM_MIGRATIONS=build/migration/**/*.js
ENV TYPEORM_ENTITIES=build/entity/**/*.js

EXPOSE 7000

RUN yarn run typeorm migration:run

CMD ["node", "/app/build/index.js"]
