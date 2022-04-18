FROM node:16
RUN mkdir -p /app/GameService
WORKDIR /app/GameService
COPY . /app/GameService
RUN npm install --unsafe-perm
EXPOSE 3032
CMD npm run deploy