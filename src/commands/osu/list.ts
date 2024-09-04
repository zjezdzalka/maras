import { APIEmbedField, ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Command from "../command.js"
import { db } from "../../utils/db.js";
import { matches, players } from "../../utils/schema.js";
import { eq, sql } from "drizzle-orm";
import player from "./player.js";
//https://cdn.discordapp.com/attachments/897129324656885770/1278829277630169211/house-md-gregory-house.gif?ex=66d23a13&is=66d0e893&hm=b1e494838e7ccfdfda4458ef10f03f3fbf7fbfe7809a64c7fe6f0be8879e6888&
export default new Command("list", "Lists matches", ApplicationCommandOptionType.Subcommand, [], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const match_query = await db.all(sql`select 
        p1.name as 'player_one_name', p2.name as 'player_two_name', m.date
        from matches m 
        join players p1 on p1.id = m.playerone_id
        join players p2 on p2.id = m.playertwo_id;
        `)
    const fields: APIEmbedField[] =
        match_query.map((e: any) => {
            let date = new Date(e.date * 1000);
            // uncomment if offset necessary
            // const offset = date.getTimezoneOffset()
            // date = new Date(date.getTime() - (offset * 60 * 1000))
            return {
                name: `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth()}`,
                value: `${e.player_one_name} vs ${e.player_two_name}`
            }
        });
    const embed = new EmbedBuilder()
        .setColor(0x2137FF)
        .setTitle("Matches")
        .addFields(fields)

    interaction.reply({ embeds: [embed] })
});