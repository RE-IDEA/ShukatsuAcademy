FROM node:14

WORKDIR /usr/src/app


COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000

# アプリケーションの起動コマンド
CMD [ "npm", "start" ]
