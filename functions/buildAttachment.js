const Discord = require('discord.js');
const {createCanvas, loadImage} = require('canvas');
const path = require('../config').path;

const buildAttachment = async (data, name, lang) => {
	if (0 >= data.length) return;
	//build new png
	const canvas = createCanvas(250 * data.length + 5 * data.length, 350);
	const ctx = canvas.getContext('2d');
	const imgArray = data.map(async card => await loadImage(`${path}card_images/${lang}/${card.card_number}.png`));
	await Promise.all(imgArray).then(final => final.forEach((img, index) => ctx.drawImage(img, 250 * index + 5 * index, 0, 250, 350)));
	return new Discord.Attachment(canvas.toBuffer(), name);
};

exports.buildAttachment = buildAttachment;