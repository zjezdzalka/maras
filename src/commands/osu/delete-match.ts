import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command, { Option } from "../command.js"
import { db } from "../../utils/db.js";
import { matches } from "../../utils/schema.js";
import { eq, sql } from "drizzle-orm";

export default new Command("delete-match", "Deletes matches", ApplicationCommandOptionType.Subcommand, [
    new Option("del", "Czy usunąć wszystkie mecze?", true, ApplicationCommandOptionType.Boolean),
    new Option("del_num", "Który mecz usunąć?", false, ApplicationCommandOptionType.String)
], async (interaction: ChatInputCommandInteraction<CacheType>) => {
    
    const delete_bool: boolean = interaction.options.data.find((e) => e.name === "del")?.value as boolean ?? false;
    const delete_num: number = parseInt(interaction.options.data.find((e) => e.name == "del_num")?.value!?.toString());
    
    await interaction.deferReply();
    
    if(delete_bool == true){
        const query = sql`DELETE FROM matches;`;
        const query2 = sql`DELETE FROM SQLITE_SEQUENCE WHERE name='matches';`;
        db.run(query);
        db.run(query2);
        await interaction.editReply("Usunięto");
    }
    else{
        const idQuery = sql`SELECT id FROM matches ORDER BY id DESC LIMIT 1`;
        const idQueryResult = db.get(idQuery) as Array<number>;
        const idQueryID = idQueryResult ? idQueryResult[0] : 0;

        const checkIfExists = sql`SELECT * FROM matches WHERE id == ${delete_num}`;
        const cIEResult = db.get(checkIfExists);

        console.log(cIEResult);

        if(delete_num > 0 && delete_num <= idQueryID){
            if(cIEResult){
                const query = sql`DELETE FROM matches WHERE id == ${delete_num}`;
                db.run(query);
                await interaction.editReply(`Usnięto wartość ${delete_num}`);
            }
            else{
                await interaction.editReply(`Wartość ${delete_num} nie istnieje.`);
            }
        }
        else{
            await interaction.editReply(`Nie można usunąć wartości ${delete_num}`);
        }
    }
});