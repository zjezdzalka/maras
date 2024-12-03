import { APIEmbedField, ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../command.js"
import { db } from "../../utils/db.js";
import { players } from "../../utils/schema.js";
import { eq, sql } from "drizzle-orm";


export default new Command("list-players", "Lists players", ApplicationCommandOptionType.Subcommand, [], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const matchQuery: any[] = await db.all(
        sql`
          SELECT * FROM players;
        `
    ) || [];

    console.log(matchQuery);

    const fields: APIEmbedField[] = matchQuery.map((player) => {
        return {
            name: `${player.id}, ${player.name}`,
            value: `osu: ${player.osu_id}, discord: <@${player.dsc_tag}>`,
            inline: false,
        };
    });

    if (fields.length === 0) {
        fields.push({
            name: "Na ten moment nie ma graczy.",
            value: "wee woo wee woo",
        });
    }

    console.log(fields);

    const embed = new EmbedBuilder()
    .setColor(0x2137ff)
    .setTitle("Players")
    .addFields(fields);

    await interaction.reply({ embeds: [embed], ephemeral: true });
});