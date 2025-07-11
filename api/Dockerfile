FROM node:22.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3000

CMD ["node", "dist/server.js"]