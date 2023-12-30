const { ChannelType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   *
   * @param {import("discord.js").Interaction} interaction
   */
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.channel.type == ChannelType.DM) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        console.log(error);
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        console.log(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};