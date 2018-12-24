const main = require('../index');
const Discord = require('discord.js');
const fetchCard = require('./fetch').fetchCard;
const fetchFAQ = require('./fetch').fetchFAQ;
const path = require('../config').path;
const emoji = require('./emoji').emoji;

const faq = async (msg, params, client) => {
	const data = fetchCard(params.slice(0, -1).join(' '));
	const embed = new Discord.RichEmbed();
	if (data) {
		const faq = await fetchFAQ(data.card_number, params.slice(-1).join());
		const house = await emoji(data.house.toLowerCase(), client);
		const title = data.card_title.replace(' ', '_').replace(/[“”]/g, '') + '.png';
		const attachment = new Discord.Attachment(`${path}card_images/${data.card_number}.png`, title);
		if (faq) {
			let link = `https://keyforge-compendium.com/cards/${data.card_number}?powered_by=archonMatrixDiscord`;
			embed.setColor('ffa500')
				.setTitle(`${data.card_title} #${data.card_number}`)
				.attachFile(attachment)
				.setThumbnail(`attachment://${title}`)
				.addField(`${house} • ${data.card_type}`, data.card_text)
				.addField(faq.question, faq.answer.length < 800 ? faq.answer + `\n\n**[KeyForge Compendium FAQ](${link})**` : faq.answer.slice(0, 800) + `...\nVisit **[KeyForge Compendium FAQ](${link})** for full answer.`)
		} else embed.setColor('FF0000').setDescription(`${data.card_title} does not have an FAQ with the keyword "${params.slice(-1).join()}"`);
	} else embed.setColor('FF0000').setDescription(`Card: ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

exports.faq = faq;