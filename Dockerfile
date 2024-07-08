FROM node:20.15
LABEL authors="Colin"
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build
CMD ["npm", "start"]