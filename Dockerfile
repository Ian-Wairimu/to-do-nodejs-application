
# specify a base image
FROM node:alpine

WORKDIR /usr/app
# install dependencies using the npm install
COPY ./package.json ./
RUN npm install
COPY ./ ./
# default command when starting our server
CMD ["npm", "start"]
