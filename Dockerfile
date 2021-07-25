FROM node:alpine

WORKDIR /bonsai/auth

COPY package.json .

RUN npm i

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/main"]