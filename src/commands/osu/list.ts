import { ActionRowBuilder, APIEmbedField, ApplicationCommandOptionType, StringSelectMenuOptionBuilder, CacheType, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuBuilder, ComponentType, ButtonStyle } from "discord.js";
import Command from "../command.js"
import { db } from "../../utils/db.js";
import { matches, players } from "../../utils/schema.js";
import { eq, sql } from "drizzle-orm";
import player from "./add-player.js";
//https://cdn.discordapp.com/attachments/897129324656885770/1278829277630169211/house-md-gregory-house.gif?ex=66d23a13&is=66d0e893&hm=b1e494838e7ccfdfda4458ef10f03f3fbf7fbfe7809a64c7fe6f0be8879e6888&
async function getResultQuery(stage: string) {
    const query = sql`
        select 
            p1.name as 'player_one_name', 
            p2.name as 'player_two_name', 
            m.date, 
            m.score, 
            m.desc,
            m.id
        from matches m 
        join players p1 on p1.id = m.playerone_id 
        join players p2 on p2.id = m.playertwo_id
        ${stage ? sql`where m.desc = ${stage}` : sql``};
    `;

    const match_query = db.all(query);

    let fields = 
        match_query.map((e: any) => {
            let date = new Date(e.date * 1000);
            // uncomment if offset necessary
            // const offset = date.getTimezoneOffset()
            // date = new Date(date.getTime() 
            let name = `${date.getHours()}:${date.getMinutes()} `;

            if(date.getDate() < 10) name += `0${date.getDate()}`; 
            else name += `${date.getDate()}`;

            name += ".";

            if(date.getMonth()+1 < 10) name += `0${date.getMonth()+1}`;
            else name += `${date.getMonth()+1}`;


            name += `.${date.getFullYear()}`;
            let score = e.score;
            let value = `${name}, <t:${(Number(date))/1000}:R>\n`; // minus 1 month bc it is 1 month ahead
            if(score != "*score not added*"){
                score.split(':');
                if(score[0] > score[2]){
                    value += `**${e.player_one_name}** vs ${e.player_two_name}\n**Wynik meczu:**   **${score[0]}**:${score[2]}`;
                }
                else{
                    value += `${e.player_one_name} vs **${e.player_two_name}**\n**Wynik meczu:**   ${score[0]}:**${score[2]}**`;
                }
            }
            else{
                value += `${e.player_one_name} vs ${e.player_two_name}\n${e.score}`;
            }

            return {
                name: "**Match ID: **" + e.id + " - **" + e.desc + "**\n" + value 
            }
        });

    console.log(fields);
    
    if (fields.length == 0){
        fields = [{ name: `\n**Brak meczy${stage==""?"":" "+stage}.**\n` }];
    }
    return fields;
}
export default new Command("list", "Lists matches", ApplicationCommandOptionType.Subcommand, [], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    let i:number = 1;
    let fields = await getResultQuery("");

    console.log(fields);
    
    const select = new StringSelectMenuBuilder()
    .setCustomId(interaction.id)
    .setPlaceholder('Select stage')
    .addOptions([
        new StringSelectMenuOptionBuilder()
        .setLabel('RO16')
        .setValue('RO16')
        .setDescription('Round of 16'),
        new StringSelectMenuOptionBuilder()
        .setLabel('QF')
        .setValue('QF')
        .setDescription('Quarterfinals'),
        new StringSelectMenuOptionBuilder()
        .setLabel('SF')
        .setValue('SF')
        .setDescription('Semifinals'),
        new StringSelectMenuOptionBuilder()
        .setLabel('F')
        .setValue('F')
        .setDescription('Finals'),
        new StringSelectMenuOptionBuilder()
        .setLabel('GF')
        .setValue('GF')
        .setDescription('Grand Finals'),
        new StringSelectMenuOptionBuilder()
        .setLabel('Wszystkie')
        .setValue('wszystkie')
        .setDescription('All matches')
    ]);

    const buttons = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select);


    const response = await interaction.reply({ 
        content: fields.map(field => field.name).join('\n\n'),
        components: [buttons],
    })

    try {
        const collector = response.createMessageComponentCollector({ 
            componentType: ComponentType.StringSelect,
            time: 30_000 ,
            filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
        });

        collector.on('collect', async (input) => {
            try{
            if(input.values[0] == "RO16") {
                fields = await getResultQuery("RO16");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            else if(input.values[0] == "QF") {
                fields = await getResultQuery("QF");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            else if(input.values[0] == 'SF') {
                fields = await getResultQuery("SF");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            else if(input.values[0] == 'F') {
                fields = await getResultQuery("F");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            else if(input.values[0] == 'GF') {
                fields = await getResultQuery("GF");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            else if(input.values[0] == 'wszystkie') {
                fields = await getResultQuery("");
                input.update({
                    content: fields.map(field => field.name).join('\n\n'),
                    components: [buttons],
                });
            }
            }
            catch(e) {console.log(e)}
        });

        setTimeout(() => {
            collector.stop();
            interaction.editReply({ content: fields.map(field => field.name).join('\n\n'), components: [] });
        }, 30_000);
    } 
    catch (e) {
        console.log(e);
        await interaction.editReply({  content: fields.map(field => field.name).join('\n\n'), components: [] });
    }

});
