FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
 RUN npx prisma migrate deploy
 EXPOSE 4000
 CMD ["node", "dist/server.js"]