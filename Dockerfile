FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

ENV PORT=35358

EXPOSE 35358

CMD ["node", "--unhandled-rejections=strict", "index.js"]
