import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command, { Option } from "../command.js"
import { db } from "../../utils/db.js";

export default new Command("add_player", "Adds player to the database", ApplicationCommandOptionType.Subcommand, [
    new Option("osu_id", "Osu ID of the player", true, ApplicationCommandOptionType.String),
    new Option("name", "Name of the player", true, ApplicationCommandOptionType.String),
    new Option("tag", "@ of the player", true, ApplicationCommandOptionType.User)
], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    console.log(interaction.options.data.find((e) => e.name === "tag"))

    interaction.reply("Invalid date format, please try again and use 'YYYY-MM-DD hh-mm'")
});