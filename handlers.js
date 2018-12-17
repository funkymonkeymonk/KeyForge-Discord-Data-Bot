const knownCommands = require('./functions/index');
const commandPrefix = require('./config').prefix;

// Called every time a message comes in:
const onMessage = (msg, client) => {
	if (msg.author.bot) return; // Ignore messages from the bot

	// This isn't a command since it has no prefix:
	if (!msg.content.includes(commandPrefix) && !msg.content.match(/[\[\]{}]/g)) return;
	let params = [], commandName;

	if (msg.content.includes(commandPrefix)) {
		if (msg.content.startsWith(commandPrefix)) params = msg.content.substr(1).split(' ');
		else params = msg.content.split(commandPrefix)[1].split(' ');
		commandName = params[0].toLowerCase();
		params = params.splice(1);
	} else if (msg.content.match(/[\[\]]/g)) {
		let parse = msg.content.split('[');
		parse.forEach(sub => sub.includes(']') && params.push(sub.split(']')[0]));
		commandName = 'brackets';
	} else if (msg.content.match(/[{}]/g)) {
		let parse = msg.content.split('{');
		parse.forEach(sub => sub.includes('}') && params.push(sub.split('}')[0]));
		commandName = 'decks';
	}

	switch (commandName) {
		case 'c':
			commandName = 'card';
			break;
		case 'd':
			commandName = 'deck';
			break;
		case 'r':
			commandName = 'rule';
			break;
		case 'rh':
		case 'random':
		case 'randomhand':
			commandName = 'randomHand';
			break;
		default:
			break;
	}

	// If the command is known, let's execute it:
	if (commandName in knownCommands) {
		console.log(`${msg.author.username}, ${commandName}, ${params}, ${new Date()}`);
		knownCommands[commandName](msg, params, client);
	}

};

// Called every time the bot connects to Twitch chat:
const onReady = client => console.log(`Logged in as ${client.user.username}!`);

exports.onMessage = onMessage;
exports.onReady = onReady;
