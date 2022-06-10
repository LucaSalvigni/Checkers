FROM node:lts-alpine as build-stage

WORKDIR /builddir
COPY . .
RUN npm install --unsafe-perm
RUN npm run gulp build

FROM node:lts-alpine as production-stage

ARG ARG_PORT
ARG ARG_DB_PSW
ARG ARG_USER_KEY
ARG ARG_USER_CERT
ARG ARG_CERTIFICATE

ENV UserService_PORT=$ARG_PORT
ENV DB_PSW=$ARG_DB_PSW
ENV USER_KEY=$ARG_USER_KEY
ENV USER_CERT=$ARG_USER_CERT
ENV CERTIFICATE=$ARG_CERTIFICATE

RUN mkdir -p /app/
WORKDIR /app/
COPY --from=build-stage /builddir/build/ .
RUN npm install --unsafe-perm
EXPOSE $ARG_PORT
CMD npm run deploy