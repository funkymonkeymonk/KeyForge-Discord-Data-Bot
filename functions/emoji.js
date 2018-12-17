const emoji = (str, client) => {
	return new Promise(resolve => {
		client.shard.broadcastEval(`(${findGuild}).call(this,'${str}')`)
			.then(emojiArray => {
				const foundEmoji = emojiArray.find(emoji => emoji);
				resolve(foundEmoji)
			}).catch(console.error);
	})
};

const findGuild = (emojiID) => {
	const guild = this.guilds.get('519921261401604106');
	if (!guild) return null;
	const emoji = guild.emojis.find(val => val.name === emojiID);
	if (!emoji) return '';
	return emoji.toString();
};

exports.emoji = emoji;
