FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start:survivor"]
