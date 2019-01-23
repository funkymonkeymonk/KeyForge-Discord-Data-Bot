export {fetchCard, fetchDeck, fetchDeckADHD, fetchDoK, fetchFAQ, fetchUnknownCard} from './fetch';
export {brackets} from './brackets';
export {buildAttachment} from './buildAttachment';
export {card} from './card';
export {faq} from './faq';
export {deck} from './deck';
export {help} from './help';
export {invite} from './invite';
export {randomHand} from './randomHand';
export {rule} from './rule';
export {stats} from './stats';
export {version} from './version';
export {emoji} from './emoji';

import {brackets} from './brackets';
import {card} from './card';
import {deck} from './deck';
import {faq} from './faq';
import {help} from './help';
import {invite} from './invite';
import {randomHand} from './randomHand';
import {rule} from './rule';
import {stats} from './stats';
import {version} from './version';

export const knownCommands = {brackets, card, deck, faq, help, invite, randomHand, rule, stats, version};