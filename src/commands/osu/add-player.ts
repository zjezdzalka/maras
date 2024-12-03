import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command, { Option } from "../command.js"
import { db } from "../../utils/db.js";
import { eq, sql } from "drizzle-orm";

export default new Command("add-player", "Adds player to the database", ApplicationCommandOptionType.Subcommand, [
    new Option("osu_id", "Osu ID of the player", true, ApplicationCommandOptionType.String),
    new Option("name", "Name of the player", true, ApplicationCommandOptionType.String),
    new Option("tag", "@ of the player", true, ApplicationCommandOptionType.User)
], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const osu_id: number = parseInt(interaction.options.data.find((e) => e.name === "osu_id")?.value as string) ?? 0;
    const name: string = interaction.options.data.find((e) => e.name === "name")?.value?.toString() ?? "";
    const tag: any = interaction.options.getUser("tag");
  
    if (isNaN(parseInt(osu_id.toString()))) {
        interaction.reply("Please give a valid osu ID");
    } else if (!name || typeof name !== 'string') {
        interaction.reply("Please give a valid osu username");
    } else {
        if (!tag) {
            interaction.reply("Invalid Discord tag information");
        } else {
            const dsc_id = tag.username;
            const dsc_tag = tag.id;
            const query = sql`INSERT INTO players (id, osu_id, name, tag, dsc_tag) 
                              VALUES (NULL, ${osu_id}, ${name}, ${dsc_id}, ${dsc_tag})`;
            db.run(query);
            interaction.reply("Inserted into DB");
        }
    }
});