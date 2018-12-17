const main = require('../index');
const Discord = require('discord.js');
const fetchCard = require('./fetch').fetchCard;
const path = require('../config').path;

const card = async (msg, params) => {
	const data = fetchCard(params.join(' ').toLowerCase());
	const embed = new Discord.RichEmbed();
	if (data) {
		const title = data.card_title.replace(' ', '_') + '.png';
		const attachment = new Discord.Attachment(`${path}card_images/${data.card_number}.png`, title);
		embed.setColor('031763')
			.setTitle(`${data.card_title}, ${data.card_number}`)
			.setDescription(`[libraryaccess.net](http://libraryaccess.net/cards/COTA/${data.card_number}?powered_by=archonMatrixDiscord) **•** [KeyForge Compendium](https://keyforge-compendium.com/cards/${data.card_number}?powered_by=archonMatrixDiscord)`)
			.attachFile(attachment)
			.setImage(`attachment://${title}`);
	} else embed.setColor('FF0000').setDescription(`Card: ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

exports.card = card;