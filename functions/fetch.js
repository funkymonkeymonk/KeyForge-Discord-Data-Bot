const cards = require('../data/cards');
const new_cards = require('../data/new_cards');
const all_cards = require('../data/all_cards');
const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const path = require('../config').path;
const deckSearchAPI = require('../config').deckSearchAPI;
const kfcAPI = require('../config').kfcAPI;
const asyncForEach = require('./basic').asyncForEach;

const fetchDeck = (name) => {
	return new Promise(resolve => {
		axios.get(encodeURI(deckSearchAPI + '?search=' + name))
			.then(async response => {
				if (response.data) {
					if (response.data.data) {
						if (response.data.data[0]) {
							let deck = response.data.data[0];
							let cards = [];
							await asyncForEach(deck.cards, async card => {
								let obj = all_cards.find(o => o.id === card);
								if (!obj) obj = await fetchUnknownCard(card, deck.id).catch(console.error);
								cards.push(obj);
							});
							resolve([deck, cards]);
						} else resolve([false, false]);
					} else resolve([false, false]);
				} else resolve([false, false]);
			}).catch(console.error);
	});
};

const fetchCard = (name) => {
	return cards.find(card => {
		let title = card.card_title.toLowerCase();
		return title === name || title.startsWith(name) || title.includes(name);
	});
};

const fetchUnknownCard = async (cardId, deckId) => {
	console.log(`${cardId} not found, fetching from the man`);
	let fetchedCards = await axios.get(`${deckSearchAPI}${deckId}/?links=cards`);
	let card = fetchedCards.data._linked.cards.find(o => o.id === cardId);
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
		const aveADHD = {a_rating: 17.79, b_rating: 17.70, c_rating: 5.26, e_rating: 6.92};
		axios.get(`${kfcAPI}decks/${deckID}.json`)
			.then(response => {
				if (response.data) {
					resolve(`${Object.keys(aveADHD).sort().map(type => `${_.toUpper(type.slice(0, 1))}: ${response.data[type].toFixed(2)} (${(response.data[type] - aveADHD[type]).toFixed(2)})`).join(' • ')}`);
				} else resolve(false);
			}).catch(console.error)
	});
};

const fetchFAQ = (card_number, search) => {
	return new Promise(resolve => {
		axios.get(`${kfcAPI}cards/${card_number}.json`)
			.then(response => {
				if (response.data) {
					if (response.data.faqs) {
						const final = [];
						response.data.faqs.forEach(faq => {
							let question = faq.question.toLowerCase();
							if (question === search || question.startsWith(search) || question.includes(search)) final.push(faq);
						});
						resolve(final);
					} else resolve(false);
				} else resolve(false);
			}).catch(console.error)
	});
};

exports.fetchDeck = fetchDeck;
exports.fetchCard = fetchCard;
exports.fetchDeckADHD = fetchDeckADHD;
exports.fetchFAQ = fetchFAQ;
exports.fetchUnknownCard = fetchUnknownCard;