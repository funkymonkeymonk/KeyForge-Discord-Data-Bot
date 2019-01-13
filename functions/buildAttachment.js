const Discord = require('discord.js');
const asyncForEach = require('./basic').asyncForEach;
const {createCanvas, loadImage} = require('canvas');
const path = require('../config').path;

const buildAttachment = async (data, name, lang) => {
	if (0 >= data.length) return;
	//fetch cards data
	let imgArray = [];
	//build new png
	const canvas = createCanvas(250 * data.length + 5 * data.length, 350);
	const ctx = canvas.getContext('2d');
	await asyncForEach(data, async card => imgArray.push(await loadImage(`${path}card_images/${lang}/${card.card_number}.png`)));
	imgArray.forEach((img, index) => ctx.drawImage(img, 250 * index + 5 * index, 0, 250, 350));
	return new Discord.Attachment(canvas.toBuffer(), name);
};

exports.buildAttachment = buildAttachment;