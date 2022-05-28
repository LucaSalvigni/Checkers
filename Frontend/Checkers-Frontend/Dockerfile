# production stage
FROM nginx:stable-alpine as production-stage

COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY /build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]