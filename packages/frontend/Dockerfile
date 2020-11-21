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

COPY packages/frontend/package.json ./packages/frontend/
COPY packages/frontend/.env.* ./packages/frontend/
COPY packages/frontend/src ./packages/frontend/src
COPY packages/frontend/public ./packages/frontend/public

RUN yarn install --frozen-lockfile
RUN yarn workspace frontend build

#
# Production stage
#

FROM nginx

COPY --from=builder /usr/src/app/packages/frontend/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY packages/frontend/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
