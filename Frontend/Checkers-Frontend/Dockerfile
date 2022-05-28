# production stage
FROM nginx:stable-alpine as production-stage

COPY /build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]