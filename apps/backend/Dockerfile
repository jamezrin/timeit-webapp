FROM node:22-slim

WORKDIR /deploy

COPY ./common/deploy /deploy

WORKDIR /deploy/apps/backend

ENV NODE_ENV=production
ENV TYPEORM_CONNECTION=postgres
ENV TYPEORM_SYNCHRONIZE=false
ENV TYPEORM_LOGGING=true
ENV TYPEORM_MIGRATIONS=dist/migration/**/*.js
ENV TYPEORM_ENTITIES=dist/entity/**/*.js

ENV PORT=80
EXPOSE 80

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["bash", "docker-entrypoint.sh"]
