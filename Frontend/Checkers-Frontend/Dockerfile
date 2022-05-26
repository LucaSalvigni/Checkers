# build stage
FROM node:lts-alpine as build-stage

ARG ARG_COMMUNICATION_SERVICE
ENV COMMUNICATION_SERVICE=$ARG_COMMUNICATION_SERVICE

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["ls"]
RUN npm run gulp build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]