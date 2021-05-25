const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

console.log('Updating skin list');

require('./Cigar2/updateSkinList.js');

const PORT = process.env.PORT || 3000;

console.log('Starting webserver');

const app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'Cigar2', 'web')));

server.listen(PORT);

console.log(`Webserver started at ${PORT}`);

/* -------------------------- OGAR II -------------------------- */

console.log('Starting Ogar II')

const DefaultSettings = require('./OgarII/src/Settings');
const ServerHandle = require('./OgarII/src/ServerHandle');

const DefaultProtocols = [
    require('./OgarII/src/protocols/LegacyProtocol'),
    require('./OgarII/src/protocols/ModernProtocol'),
];

const DefaultGamemodes = [
    require('./OgarII/src/gamemodes/FFA'),
    require('./OgarII/src/gamemodes/Teams'),
    require('./OgarII/src/gamemodes/LastManStanding')
];

function readSettings() {
    try {
        return JSON.parse(fs.readFileSync('./settings.json', 'utf-8'));
    } catch (e) {
        console.log('caught error while parsing/reading settings.json:', e.stack);
        process.exit(1);
    }
}

function overwriteSettings(settings) {
    fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 4), 'utf-8');
}

if (!fs.existsSync('./settings.json')) {
    overwriteSettings(DefaultSettings);
}

let settings = readSettings();

const currentHandle = new ServerHandle(settings, server);
overwriteSettings(currentHandle.settings);
require('./OgarII/cli/log-handler')(currentHandle);

currentHandle.protocols.register(...DefaultProtocols);
currentHandle.gamemodes.register(...DefaultGamemodes);

currentHandle.start();