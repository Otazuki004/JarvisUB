FROM node

WORKDIR /root/Jarvis
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "index.js"]
