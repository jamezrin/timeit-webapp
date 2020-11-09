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

CMD ["node", "/app/build/index.js"]
