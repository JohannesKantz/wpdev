# Specify a base image
FROM node:alpine

#Install some dependencies

WORKDIR /
COPY ./web/app /
RUN npm install -g npm
RUN npm install
RUN npm run build
RUN npx prisma db push

# Set up a default command
CMD ["npm", "run", "start"]