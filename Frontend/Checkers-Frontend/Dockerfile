FROM node:lts-alpine as build-stage

ARG ARG_VUE_APP_COMMUNICATION_SERVICE
ENV VUE_APP_COMMUNICATION_SERVICE=$ARG_VUE_APP_COMMUNICATION_SERVICE

WORKDIR /app
COPY . .
RUN npm install --unsafe-perm
RUN npm run gulp build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage app/build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]