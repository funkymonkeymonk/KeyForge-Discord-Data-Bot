import Discord from 'discord.js';
import {sendMessage} from '../discord'
import {default as pack} from '../package';

export const version = (msg) => {
	const embed = new Discord.RichEmbed()
		.setColor('777777')
		.setDescription(`**Version:** ${pack.version}`);
	sendMessage(msg, {embed});
};