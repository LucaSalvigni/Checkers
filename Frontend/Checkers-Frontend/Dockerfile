# production stage
FROM nginx:stable-alpine as production-stage

ARG ARG_COMMUNICATION_SERVICE
ENV VUE_APP_COMMUNICATION_SERVICE=$ARG_COMMUNICATION_SERVICE

COPY /build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]