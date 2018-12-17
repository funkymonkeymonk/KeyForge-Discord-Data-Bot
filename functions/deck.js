const main = require('../index');
const Discord = require('discord.js');
const fetchDeck = require('./fetch').fetchDeck;
const fetchDeckADHD = require('./fetch').fetchDeckADHD;
const asyncForEach = require('./basic').asyncForEach;
const emoji = require('./emoji').emoji;

const deck = async (msg, params, client) => {
	let [deck, cards] = await fetchDeck(params.join('+'));
	const embed = new Discord.RichEmbed();
	if (deck) {
		const houses = await getHouses(deck._links.houses, client);
		const cardStats = await getCardStats(cards);
		const mavericks = `${await emoji('maverick', client)}: ${cardStats.is_maverick}`;
		const rarity = await getRarity(cardStats.rarity, client);
		const deckADHD = await fetchDeckADHD(deck.id);

		embed.setColor('178110')
			.setTitle(deck.name)
			.addField(houses, `[Official](https://www.keyforgegame.com/deck-details/${deck.id}?powered_by=archonMatrixDiscord) **•** [KeyForge Compendium](https://keyforge-compendium.com/decks/${deck.id}?powered_by=archonMatrixDiscord)`)
			.addField(deckADHD ? deckADHD : `ADHD unavailable, register https://keyforge-compendium.com/decks/${deck.id}?powered_by=archonMatrixDiscord`, Object.keys(cardStats.card_type).map(type => `${type}: ${cardStats.card_type[type]}`).join(' **•** '))
			.addField(rarity + ', ' + mavericks, `Data fetch ${new Date()}`);
	} else embed.setColor('FF0000').setDescription(`Deck - ${params.join(' ')}: not found!`);

	main.sendMessage(msg, {embed});
};

const getHouses = (houses, client) => {
	return new Promise(async resolve => {
		let text = [];
		await asyncForEach(houses, async house => text.push(await emoji(house.toLowerCase(), client)));
		resolve(text.join(' **•** '))
	});
};

const getRarity = (rarity, client) => {
	return new Promise(async resolve => {
		let text = [];
		await asyncForEach(Object.keys(rarity), async type => text.push(`${await emoji(type.toLowerCase(), client)}: ${rarity[type]}`));
		resolve(text.join(', '))
	});
};

const getCardStats = (cards) => {
	return new Promise(async resolve => {
		let cardStats = {
			card_type: {
				Action: 0, Creature: 0, Upgrade: 0, Artifact: 0
			},
			rarity: {
				Common: 0, Uncommon: 0, Rare: 0, Special: 0
			},
			is_maverick: 0,
		};
		await asyncForEach(cards, async card => {
			cardStats.card_type[card.card_type]++;
			card.rarity === 'FIXED' ? cardStats.rarity.Special++ : cardStats.rarity[card.rarity]++;
			if (card.is_maverick) cardStats.is_maverick++;
		});
		resolve(cardStats)
	});
};

exports.deck = deck;