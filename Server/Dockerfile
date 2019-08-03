FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm instaLL
COPY . .
CMD node app.js
EXPOSE 8003
