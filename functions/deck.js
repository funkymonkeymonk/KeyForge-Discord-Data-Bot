const main = require('../index');
const Discord = require('discord.js');
const fetchDeck = require('./fetch').fetchDeck;
const fetchDeckADHD = require('./fetch').fetchDeckADHD;
const emoji = require('./emoji').emoji;

const deck = async (msg, params, client) => {
	const [deck, cards] = await fetchDeck(params.join('+'));
	const embed = new Discord.RichEmbed();
	if (deck) {
		const houses = await getHouses(deck._links.houses, client);
		const cardStats = getCardStats(cards);
		const mavericks = `${await emoji('maverick', client)}: ${cardStats.is_maverick}`;
		const rarity = await getRarity(cardStats.rarity, client);
		const deckADHD = await fetchDeckADHD(deck.id);

		embed.setColor('178110')
			.setTitle(deck.name)
			.addField(houses, `[Official](https://www.keyforgegame.com/deck-details/${deck.id}?powered_by=archonMatrixDiscord) **•** [KeyForge Compendium](https://keyforge-compendium.com/decks/${deck.id}?powered_by=archonMatrixDiscord) **•** [Burger Tokens](https://burgertokens.com/pages/keyforge-deck-analyzer?deck=${deck.id}&powered_by=archonMatrixDiscord)`)
			.addField(deckADHD ? deckADHD : `ADHD unavailable, register https://keyforge-compendium.com/decks/${deck.id}?powered_by=archonMatrixDiscord`, Object.keys(cardStats.card_type).map(type => `${type}: ${cardStats.card_type[type]}`).join(' **•** '))
			.addField(rarity + ', ' + mavericks, `Data fetch ${new Date()}`)
			.setImage(`https://keyforge-compendium.com/decks/${deck.id}/image.png`)
	} else embed.setColor('FF0000').setDescription(`Deck - ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

const getHouses = (houses, client) => {
	return new Promise(async resolve => {
		const data = houses.map(async house => await emoji(house.toLowerCase(), client));
		Promise.all(data).then(final => resolve(final.join(' **•** ')));
	});
};

const getRarity = (rarity, client) => {
	return new Promise(async resolve => {
		const data = Object.keys(rarity).map(async type => `${await emoji(type.toLowerCase(), client)}: ${rarity[type]}`);
		Promise.all(data).then(final => resolve(final.join(', ')));
	});
};

const getCardStats = (cards) => {
	return {
		card_type: cards.reduce((acc, card) => ({...acc, [card.card_type]: acc[card.card_type] + 1}),
			{Action: 0, Artifact: 0, Creature: 0, Upgrade: 0}
		),
		rarity: cards.reduce((acc, card) => ({...acc, [card.rarity]: acc[card.rarity] + 1}),
			{Common: 0, Uncommon: 0, Rare: 0, Special: 0}
		),
		is_maverick: cards.filter(card => card.is_maverick).length,
	};
};

exports.deck = deck;