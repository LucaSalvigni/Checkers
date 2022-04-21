FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install --unsafe-perm

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]