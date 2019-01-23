const path = require('./config').path;
const token = require('./config').token;
const {ShardingManager} = require('discord.js');
const manager = new ShardingManager(`${path}index.js`, {token});
manager.spawn().catch(console.error);
