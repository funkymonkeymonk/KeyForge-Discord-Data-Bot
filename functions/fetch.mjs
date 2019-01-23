import axios from 'axios';
import fs from 'fs';
import _ from 'lodash';
import {deckSearchAPI, dokAPI, kfcAPI, path} from '../config'
import {all_cards, cards, new_cards} from '../data/index';

export const fetchDeck = (name) => {
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

export const fetchCard = (name, lang) => {
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

export const fetchUnknownCard = async (cardId, deckId) => {
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

export const fetchDeckADHD = (deckID) => {
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

export const fetchDoK = (deckID) => {
	return new Promise(resolve => {
		const aveAERC = {a_rating: 7, e_rating: 20, r_rating: 1, c_rating: 13};
		axios.get(`${dokAPI}${deckID}`)
			.then(response => {
				if (response.data) {
					const {amberControl: A, expectedAmber: E, artifactControl: R, creatureControl: C, sasRating, cardsRating, synergyRating, antisynergyRating} = response.data.deck,
						sas = `${sasRating} SAS = ${cardsRating} + ${synergyRating} - ${antisynergyRating} (Card Rating + Synergy + Antisynergy)`,
						deckAERC = `A: ${A} (${A - aveAERC.a_rating}) • E: ${E} (${E - aveAERC.e_rating}) • R: ${R} (${R - aveAERC.r_rating}) • C: ${C} (${C - aveAERC.c_rating})`;
					resolve({sas, deckAERC});
				} else resolve([false, false]);
			}).catch(console.error);
	});
};

export const fetchFAQ = (card_number, search) => {
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
