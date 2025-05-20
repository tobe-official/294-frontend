FROM node:24 AS dev

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm","run", "start"]
