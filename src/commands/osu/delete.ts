import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command from "../command.js"

export default new Command("delete", "Deletes matches", ApplicationCommandOptionType.Subcommand, [], (interaction: ChatInputCommandInteraction<CacheType>) => {
    interaction.reply("I love watermelon")
});