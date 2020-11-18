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
ENV TYPEORM_MIGRATIONS=build/migration/**/*.js
ENV TYPEORM_ENTITIES=build/entity/**/*.js

ENV PORT=80
EXPOSE 80

COPY docker-entrypoint.sh ./
RUN ["chmod", "+x", "docker-entrypoint.sh"]
ENTRYPOINT ["bash", "/app/docker-entrypoint.sh"]
