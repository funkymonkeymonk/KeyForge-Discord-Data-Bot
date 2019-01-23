import Discord from 'discord.js';
import {path, token} from './config';

const manager = new Discord.ShardingManager(`${path}discord.mjs`, {token});
manager.spawn().catch(console.error);
