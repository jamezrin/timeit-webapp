#
# Build stage
#

FROM node:16-slim AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python3 build-essential

RUN npm install -g @microsoft/rush pnpm

COPY . .

RUN rush install --purge

RUN rush build --to @timeit/backend

RUN rush deploy -p @timeit/backend --overwrite

#
# Production stage
#

FROM node:16-slim

WORKDIR /app

COPY --from=builder /usr/src/app/common/deploy .

ENV NODE_ENV=production
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_LOGGING=true
ENV TYPEORM_MIGRATIONS=dist/migration/**/*.js
ENV TYPEORM_ENTITIES=dist/entity/**/*.js

ENV PORT=80
EXPOSE 80

COPY apps/backend/docker-entrypoint.sh .
RUN ["chmod", "+x", "docker-entrypoint.sh"]
ENTRYPOINT ["bash", "/app/docker-entrypoint.sh"]
