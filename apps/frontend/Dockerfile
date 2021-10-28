FROM nginx

COPY ./apps/frontend/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80

COPY apps/frontend/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]
