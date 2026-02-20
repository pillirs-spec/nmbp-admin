FROM ghcr.io/techknowkraftai/node

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 7001

CMD [ "npm", "start" ]