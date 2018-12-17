const main = require('../index');
const Discord = require('discord.js');

const invite = (msg) => {
	const embed = new Discord.RichEmbed()
		.setColor('777777')
		.setTitle(`**Invite**`)
		.setDescription(`Click [here](https://discordapp.com/oauth2/authorize?client_id=519903193149210626&scope=bot&permissions=278528) to invite the bot to your server!`);
	main.sendMessage(msg, {embed});
};

exports.invite = invite;