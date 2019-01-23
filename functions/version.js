const main = require('../index');
const pakeage = require('../package');
const Discord = require('discord.js');

const version = (msg) => {
	const embed = new Discord.RichEmbed()
		.setColor('777777')
		.setDescription(`**Version:** ${pakeage.version}`);
	main.sendMessage(msg, {embed});
};

exports.version = version;