#
# Build stage
#

FROM node:12 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY .env.* ./
COPY public ./public
COPY src ./src

RUN yarn install --frozen-lockfile && yarn build

#
# Production stage
#

FROM nginx

COPY --from=builder /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
