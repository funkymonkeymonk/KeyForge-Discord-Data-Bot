import Discord from 'discord.js'
import {sendMessage} from '../discord'
import {buildAttachment, fetchCard} from './index'

export const brackets = async (msg, params, client, lang) => {
	params = params.slice(0, 5);
	//fetch cards data
	const cards = params.map(card => fetchCard(card, lang));
	const error = cards.map((val, index) => !val && `\n${params[index]} not found!`).filter(Boolean).join(' ');
	const final = cards.filter(Boolean);
	const embed = new Discord.RichEmbed();
	if (0 < final.length) {
		const name = final.map(card => `${card.card_number}`).join('_') + '.png';
		const attachment = await buildAttachment(final, name, lang);
		embed.setColor('4B0082')
			.setDescription(`${final.map(card => `**[${card.card_title} #${card.card_number}](https://keyforge-compendium.com/cards/${card.card_number}?powered_by=archonMatrixDiscord)**`).join(', ')}\n${error}`)
			.attachFile(attachment)
			.setImage(`attachment://${name}`)
			.setFooter(`Links provided by KeyForge Compendium`);
	} else embed.setColor('FF0000').setDescription(error);

	sendMessage(msg, {embed});
};