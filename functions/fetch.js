const cards = require('../data/');
const new_cards = require('../data/new_cards');
const all_cards = require('../data/all_cards');
const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const path = require('../config').path;
const deckSearchAPI = require('../config').deckSearchAPI;
const kfcAPI = require('../config').kfcAPI;
const dokAPI = require('../config').dokAPI;

const fetchDeck = (name) => {
	return new Promise(resolve => {
		axios.get(encodeURI(deckSearchAPI + '?search=' + name))
			.then(async response => {
				const deck = _.get(response, 'data.data[0]', false);
				const cardList = _.get(deck, 'cards', []);
				const cards = cardList.map(async card => {
					const data = all_cards.find(o => o.id === card);
					return data ? data : await fetchUnknownCard(card, deck.id).catch(console.error);
				});
				Promise.all(cards).then(finalCards => resolve([deck, finalCards]));
			}).catch(console.error);
	});
};

const fetchCard = (name, lang) => {
	let final;
	final = cards[lang].find(card => card.card_title.toLowerCase() === name);
	if (final) return final;
	final = cards[lang].find(card => card.card_title.toLowerCase().startsWith(name));
	if (final) return final;
	final = cards[lang].find(card => card.card_title.toLowerCase().endsWith(name));
	if (final) return final;
	final = cards[lang].find(card => card.card_number === +name);
	return final;
};

const fetchUnknownCard = async (cardId, deckId) => {
	console.log(`${cardId} not found, fetching from the man`);
	const fetchedCards = await axios.get(`${deckSearchAPI}${deckId}/?links=cards`);
	const card = fetchedCards.data._linked.cards.find(o => o.id === cardId);
	if (!new_cards.find(o => o.id === cardId)) {
		fs.writeFile(`${path}/data/new_cards.json`, JSON.stringify(new_cards.concat(card)), (err) => {
			if (err) throw err;
			console.log(`${cardId} has been added to new_cards.json`);
		});
	}
	return card;
};

const fetchDeckADHD = (deckID) => {
	return new Promise(resolve => {
		const aveADHD = {a_rating: 17.57, b_rating: 18.28, e_rating: 7.58, c_rating: 5.51};
		axios.get(`${kfcAPI}decks/${deckID}.json`)
			.then(response => {
				if (response.data) {
					resolve(`${Object.keys(aveADHD).sort().map(type => `${_.toUpper(type.slice(0, 1))}: ${response.data[type].toFixed(2)} (${(response.data[type] - aveADHD[type]).toFixed(2)})`).join(' • ')}`);
				} else resolve(false);
			}).catch(console.error);
	});
};

const fetchDoK = (deckID) => {
	return new Promise(resolve => {
		const aveAERC = {a_rating: 7, e_rating: 20, r_rating: 1, c_rating: 13};
		axios.get(`${dokAPI}${deckID}`)
			.then(response => {
				if (response.data) {
					const dokStats = response.data.deck,
						sas = `${dokStats.sasRating} SAS = ${dokStats.cardsRating} Card Rating + ${dokStats.synergyRating} Synergy - ${dokStats.antisynergyRating} Antisynergy`,
						deckAERC = `A: ${dokStats.expectedAmber} (${aveAERC.a_rating}) E: ${dokStats.amberControl} (${aveAERC.e_rating}) R: ${dokStats.artifactControl} (${aveAERC.r_rating}) C: ${dokStats.creatureControl} (${aveAERC.c_rating})`;
					console.log(response.data.deck);
					resolve({sas: sas, deckAERC: deckAERC});
				} else resolve([false, false]);
			}).catch(console.error);
	});
};

const fetchFAQ = (card_number, search) => {
	return new Promise(resolve => {
		axios.get(`${kfcAPI}cards/${card_number}.json`)
			.then(response => {
				const data = _.get(response, 'data.faqs', []),
					final = data.map(faq => {
						const question = faq.question.toLowerCase();
						if (question === search || question.startsWith(search) || question.includes(search)) return faq;
					}).filter(Boolean);
				resolve(final);
			}).catch(console.error)
	});
};

exports.fetchDeck = fetchDeck;
exports.fetchCard = fetchCard;
exports.fetchDeckADHD = fetchDeckADHD;
exports.fetchDoK = fetchDoK;
exports.fetchFAQ = fetchFAQ;
exports.fetchUnknownCard = fetchUnknownCard;