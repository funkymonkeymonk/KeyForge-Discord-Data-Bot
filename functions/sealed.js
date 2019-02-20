const main = require('../index');
const Discord = require('discord.js');
const fetchDeckBasic = require('./fetch').fetchDeckBasic;
const fetchRandomDecks = require('./fetch').fetchRandomDecks;

const emoji = require('./emoji').emoji;

const sealed = async (msg) => {
	const embed = new Discord.RichEmbed()
			.setColor('ffff00'),
		deckIDs = await fetchRandomDecks(2);

	Promise.all(deckIDs.map(id => fetchDeckBasic(id)))
		.then(decks => {
			const houses = decks.map(deck => deck._links.houses.map(house => emoji(house.toLowerCase())).join(' **•** ')),
				links = decks.map(deck => `[Official](https://www.keyforgegame.com/deck-details/${deck.id}?powered_by=archonMatrixDiscord) **•** [KFC](https://keyforge-compendium.com/decks/${deck.id}?powered_by=archonMatrixDiscord) **•** [BT](https://burgertokens.com/pages/keyforge-deck-analyzer?deck=${deck.id}&powered_by=archonMatrixDiscord) **•** [DoK](https://decksofkeyforge.com/decks/${deck.id}?powered_by=archonMatrixDiscord)`);

			embed.addField('Deck 1', decks[0].name)
				.addField(houses[0], links[0])
				.addBlankField(true)
				.addField('Deck 2', decks[1].name)
				.addField(houses[1], links[1]);
			main.sendMessage(msg, {embed});
		});
};

exports.sealed = sealed;