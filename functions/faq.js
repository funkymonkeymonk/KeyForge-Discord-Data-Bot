const main = require('../index');
const Discord = require('discord.js');
const fetchCard = require('./fetch').fetchCard;
const fetchFAQ = require('./fetch').fetchFAQ;
const path = require('../config').path;
const emoji = require('./emoji').emoji;

const faq = async (msg, params, client) => {
	const data = fetchCard(params.length > 1 ? params.slice(0, -1).join(' ') : params.join(' '));
	const embed = new Discord.RichEmbed();
	if (data) {
		let link = `https://keyforge-compendium.com/cards/${data.card_number}?powered_by=archonMatrixDiscord`;
		const searchTerm = params.length > 1 ? params.slice(-1).join() : '';
		const faqs = await fetchFAQ(data.card_number, searchTerm);
		const house = await emoji(data.house.toLowerCase(), client);
		const rarity = await emoji(data.rarity.toLowerCase(), client);
		const title = data.card_title.replace(' ', '_').replace(/[“”]/g, '') + '.png';
		const attachment = new Discord.Attachment(`${path}card_images/${data.card_number}.png`, title);
		embed.setColor('ffa500')
			.setTitle(`${data.card_title} #${data.card_number}`)
			.attachFile(attachment)
			.setThumbnail(`attachment://${title}`)
			.addField(`${house} • ${rarity} • ${data.card_type}`, data.card_text);
		faqs.forEach(faq => {
			embed.addField(faq.question, faq.answer.length < 800 ? faq.answer : faq.answer.slice(0, 800) + `...\nVisit **[KeyForge Compendium FAQ](${link})** for full answer.`)
		});
		if (faqs.length <= 0) embed.addField(`There are no FAQs currently for ${data.card_title} with the search term "${searchTerm}"`, `[Ask the Developers](https://www.fantasyflightgames.com/en/contact/rules/?powered_by=archonMatrixDiscord)`);
		embed.addField('Data Provided by', `[KeyForge Compendium FAQ](${link})`);
	} else embed.setColor('FF0000').setDescription(`Card: ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

exports.faq = faq;