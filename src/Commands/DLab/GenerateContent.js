const { SlashCommandBuilder } = require('discord.js');
const { generateContent } = require("../../Modules/Gemini.js");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('generatecontent')
		.setDescription('잼민이 능지 테스트')
		.addStringOption(option => 
			option
			.setName('prompt')
			.setDescription('세이프티 진짜 개빡치네')
			.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const prompt = interaction.options.getString('prompt');
		text = await generateContent(prompt);
		await interaction.followUp(text);
	},
};