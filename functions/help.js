const main = require('../index');
const Discord = require('discord.js');
const prefix = require('../config').prefix;

const help = (msg, params) => {
	const embed = new Discord.RichEmbed()
		.setTitle('Help')
		.setColor('2D7C2F');
	switch (params[0]) {
		case 'adhd':
			embed
				.addField('A: Æmber', 'An approximation of how much Æmber your deck will generate with minimal piloting. Many cards can create more Æmber than this projects, but few will do less. Decks with Higher Æmber rankings are decks with more Æmber on play cards, more reap abilities, more stealing, and in general better Æmber production.')
				.addField('B: Board', 'Represents your decks ability to control the board. It is influenced by your creature count, ability to damage enemy creatures, ability to clear the board, and ability to destroy artifacts.')
				.addField('C: Æmber Control', 'Ability to control your opponents Æmber supply, either through stealing, capturing, or destroying their Æmber.')
				.addField('E: Efficiency', 'Looser metric that applies to card effects that will allow you to play or use more cards in a turn. Archiving your cards, drawing cards, and activating cards from other factions all play in. It also covers effects that limit your opponents ability to play cards.');
			break;
		default:
			embed.addField(`${prefix}card cardName/card# (-en/-es/-it/-de/-fr)`, 'Searches and displays Card. Add -lang tag to specify language.')
				.addField(`${prefix}deck deckName`, 'Searches and displays Deck.')
				.addField(`${prefix}randomhand deckName`, 'Draws 6 Random cards from selected deck.')
				.addField(`${prefix}rule ruleName`, 'Searches and displays Rule.')
				.addField(`${prefix}invite`, 'Get the invite link.')
				.addField(`${prefix}version`, 'Get the version number of current bot.')
				.addField(`${prefix}faq cardName searchTerm`, 'Get any FAQ of the specified card containing specific term.')
				.addField(`[card name 1] [card name 2] (-en/-es/-it/-de/-fr)`, 'Searches and displays card as an single image (up to 5) [] required. Add -lang tag to specify language.')
				.addField('More Information', 'For more information or help join the [KeyForge Lounge](https://discordapp.com/invite/PcTGhr9)')
				.addField('KeyForge by Fantasy Flight Games', `[KeyForge](https://www.fantasyflightgames.com/en/products/keyforge/?powered_by=archonMatrixDiscord)`);
			break;
	}
	main.sendMessage(msg, {embed});
};


exports.help = help;