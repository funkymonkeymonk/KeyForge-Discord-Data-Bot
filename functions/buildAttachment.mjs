import canvas from 'canvas';
import Discord from 'discord.js'
import {path} from '../config';

export const buildAttachment = async (data, name, lang) => {
	if (0 >= data.length) return;
	//build new png
	const image = canvas.createCanvas(250 * data.length + 5 * data.length, 350);
	const ctx = image.getContext('2d');
	const imgArray = data.map(async card => await canvas.loadImage(`${path}card_images/${lang}/${card.card_number}.png`));
	await Promise.all(imgArray).then(final => final.forEach((img, index) => ctx.drawImage(img, 250 * index + 5 * index, 0, 250, 350)));
	return new Discord.Attachment(image.toBuffer(), name);
};