import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command from "../command.js"

export default new Command("list", "Lists matches", ApplicationCommandOptionType.Subcommand, [], (interaction: ChatInputCommandInteraction<CacheType>) => {
    interaction.reply("I love broccoli")
});