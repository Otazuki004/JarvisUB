FROM node

WORKDIR /root/Jarvis
COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["node", "index.js"]
