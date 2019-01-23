import Discord from 'discord.js';
import {token} from './config'
import {onMessage, onReady} from './functions/handlers'

const client = new Discord.Client();

client.login(token).catch(error => console.error(error));

// Register our event handlers (defined below):
client.on('message', msg => onMessage(msg, client));
client.on('ready', () => onReady(client));

export const sendMessage = (message, text, attachment) => message.channel.send(text, attachment && attachment).catch(console.error);