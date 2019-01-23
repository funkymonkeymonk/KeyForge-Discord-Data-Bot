const main = require('../index');
const Discord = require('discord.js');
const fetchDeck = require('./fetch').fetchDeck;
const buildAttachment = require('./buildAttachment').buildAttachment;
const _ = require('lodash');

const randomHand = async (msg, params, client, lang) => {
	let [deck, cards] = await fetchDeck(params.join('+'));
	const embed = new Discord.RichEmbed();
	if (deck) {
		//grab 6 random cards
		const randomCards = [...Array(6)].map(() => _.pullAt(cards.sort(() => Math.random() - 0.5), _.random(cards.length - 1))[0]).sort((a, b) => a.card_number - b.card_number);

		//build Title
		const name = randomCards.map(card => `${card.card_number}`).join('_') + '.png';
		const attachment = await buildAttachment(randomCards, name, lang);

		embed.setColor('007f00')
			.setTitle('Random hand from ' + deck.name)
			.attachFile(attachment)
			.setImage(`attachment://${name}`);
	} else embed.setColor('FF0000').setDescription(`Deck - ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

exports.randomHand = randomHand;