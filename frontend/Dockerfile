FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

RUN npm run build

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
