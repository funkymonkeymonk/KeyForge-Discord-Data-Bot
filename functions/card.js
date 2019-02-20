const main = require('../index');
const Discord = require('discord.js');
const fetchCard = require('./fetch').fetchCard;
const path = require('../config').path;

const card = async (msg, params, client, lang) => {
	const data = fetchCard(params.join(' '), lang);
	const embed = new Discord.RichEmbed();
	if (data) {
		const title = `${data.card_number}.png`;
		const attachment = new Discord.Attachment(`${path}card_images/${data.language}/${data.expansion}/${data.card_number}.png`, title);
		embed.setColor('031763')
			.setDescription(`**[${data.card_title} #${data.card_number}](https://keyforge-compendium.com/cards/${data.card_number}?powered_by=archonMatrixDiscord)**`)
			.attachFile(attachment)
			.setImage(`attachment://${title}`)
			.setFooter(`Link provided by KeyForge Compendium`);
	} else embed.setColor('FF0000').setDescription(`Card: ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

exports.card = card;