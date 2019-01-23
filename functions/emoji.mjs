export const emoji = (str, client) => {
	return new Promise(resolve => {
		client.shard.broadcastEval(`(${findGuild}).call(this,'${str}')`)
			.then(emojiArray => resolve(emojiArray.find(emoji => emoji)))
			.catch(console.error);
	})
};

const findGuild = (emojiID) => {
	const guild = this.guilds.get('519921261401604106');
	if (!guild) return emojiID;
	const emoji = guild.emojis.find(val => val.name === emojiID);
	return emoji ? emoji.toString() : emojiID;
};
