const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionData;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData,
});

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        io.emit('qr', url);
    });
});

client.on('ready', () => {
    console.log('WhatsApp is ready!');
    io.emit('ready', 'WhatsApp is ready!');
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', () => {
    fs.unlinkSync(SESSION_FILE_PATH);
    console.log('WhatsApp disconnected!');
    io.emit('disconnected', 'WhatsApp disconnected!');
    client.initialize();
});

client.on('message', async (message) => {
    if (message.from === message.to) {
        if (message.body === '.start') {
            await message.reply('Bot has started! How can I assist you?');
        }
    }
});

client.initialize();

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
