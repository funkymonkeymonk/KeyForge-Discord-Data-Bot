import Discord from 'discord.js';
import _ from 'lodash';
import {rules} from '../data/index';
import {sendMessage} from '../discord'

export const rule = (msg, params) => {
	let i = _.findIndex(Object.keys(rules), term => term === params.join(' ') || term.startsWith(params.join(' ')));
	const key = Object.keys(rules)[i];
	let embed = new Discord.RichEmbed();

	if (key) {
		embed.setColor('1DE5C7')
			.setTitle(`RULE - ${_.upperCase(key)}`)
			.setDescription(rules[key]);
	}
	else embed.setColor('FF0000').setDescription(`Rule: ${params.join(' ')} not found`);

	sendMessage(msg, {embed});
};