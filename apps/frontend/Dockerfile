#
# Build stage
#

FROM node:16-slim AS builder

WORKDIR /usr/src/app

RUN npm install -g @microsoft/rush pnpm

COPY . .

RUN rush install --purge

RUN rush build --to @timeit/frontend

RUN rush deploy -p @timeit/frontend --overwrite

#
# Production stage
#

FROM nginx

COPY --from=builder /usr/src/app/apps/frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

COPY apps/frontend/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
