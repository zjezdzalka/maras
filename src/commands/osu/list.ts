import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Command from "../command.js"

export default new Command("list", "Lists matches", (interaction: ChatInputCommandInteraction<CacheType>) => {
    interaction.reply("I love broccoli")
});