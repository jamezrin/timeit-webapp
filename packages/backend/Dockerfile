#
# Build stage
#

FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.base.json ./

COPY packages/common/package.json ./packages/common/
COPY packages/common/tsconfig.json ./packages/common/
COPY packages/common/src ./packages/common/src

COPY packages/backend/package.json ./packages/backend/
COPY packages/backend/tsconfig.json ./packages/backend/
COPY packages/backend/src ./packages/backend/src

RUN yarn install --frozen-lockfile
RUN yarn workspace backend build

#
# Production stage
#

FROM node:12

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY packages/common/package.json ./packages/common/
COPY --from=builder /usr/src/app/packages/common/build ./packages/common/build
COPY --from=builder /usr/src/app/packages/common/node_modules ./packages/common/node_modules

COPY packages/backend/package.json ./packages/backend/
COPY --from=builder /usr/src/app/packages/backend/build ./packages/backend/build
COPY --from=builder /usr/src/app/packages/backend/node_modules ./packages/backend/node_modules

ENV NODE_ENV=production
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_LOGGING=true
ENV TYPEORM_MIGRATIONS=packages/backend/build/migration/**/*.js
ENV TYPEORM_ENTITIES=packages/backend/build/entity/**/*.js

ENV PORT=80
EXPOSE 80

COPY packages/backend/docker-entrypoint.sh ./
RUN ["chmod", "+x", "docker-entrypoint.sh"]
ENTRYPOINT ["bash", "/app/docker-entrypoint.sh"]
