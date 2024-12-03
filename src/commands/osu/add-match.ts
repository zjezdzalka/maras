import { ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction } from "discord.js";
import Command, { Option } from "../command.js"
import parseDate from "../../utils/date.js";
import { db } from "../../utils/db.js";
import { eq, sql } from "drizzle-orm";
import { CronJob } from 'cron';

export default new Command("add-match", "Adds match", ApplicationCommandOptionType.Subcommand, [
  new Option("player_one_id", "Osu ID of player one", true, ApplicationCommandOptionType.String),
  new Option("player_two_id", "Osu ID of player two", true, ApplicationCommandOptionType.String),
  new Option("desc", "What level is this match", true, ApplicationCommandOptionType.String),
  new Option("date", "Date of scheduled match in YYYY-MM-DD hh:mm format", true, ApplicationCommandOptionType.String),
], async (interaction: ChatInputCommandInteraction<CacheType>) => {

  const date: string = interaction.options.data.find((e) => e.name === "date")!?.value!.toString();
  const player_one_id: number = parseInt(interaction.options.data.find((e) => e.name === "player_one_id")?.value as string) ?? 0;
  const player_two_id: number = parseInt(interaction.options.data.find((e) => e.name === "player_two_id")?.value as string) ?? 0;
  const desc: string = interaction.options.data.find((e) => e.name === "desc")!?.value!.toString();
  // Matches YYYY-MM-DD hh:mm
  const date_regex = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/;
  const desc_regex = /^RO16|QF|SF|F|GF$/;

if (date.match(date_regex)) {
  let parsed: Date = new Date(parseDate(date).getTime() - 1*60000);
  let parsed_start: Date = new Date(parseDate(date));
  if (isNaN(parsed.getTime())) {
    interaction.reply("Invalid Date");
  }
  else if(!desc.match(desc_regex)){
    interaction.reply("Podałeś zły stage meczu.");
  }
  else if(parsed.getTime()-60000 < Date.now()){
    interaction.reply("Date is in the past");
  }
  else if(player_one_id === player_two_id){
    interaction.reply("Players cannot play against themselves");
  }
  else {
    console.log(parsed);
    console.log(date);

    console.log(player_one_id);
    console.log(player_two_id);
    
    await interaction.deferReply({ephemeral: true}); 
    
    await interaction.editReply("Match reminder set.");

    const playerOneQuery = sql`SELECT dsc_tag FROM players WHERE id = ${player_one_id}`;
    const playerOneTag = db.get(playerOneQuery) as Array<{ dsc_tag: string }>;
    const playerOneResult = playerOneTag ? playerOneTag[0] : undefined;

    if (!playerOneResult) {
      await interaction.editReply("Player one not found.");
      return;
    }


    const playerTwoQuery = sql`SELECT dsc_tag FROM players WHERE id = ${player_two_id}`;
    const playerTwoTag = db.get(playerTwoQuery) as Array<{ dsc_tag: string }>;
    const playerTwoResult = playerTwoTag ? playerTwoTag[0] : undefined;

    if (!playerTwoResult) {
      await interaction.editReply("Player two not found.");
      return;
    }

    console.log(playerOneTag);
    console.log(playerTwoTag);
    console.log(playerOneResult);
    console.log(playerTwoResult);

    const query = sql`INSERT INTO matches (id, date, score, desc, playerone_id, playertwo_id) 
                      VALUES (NULL, ${(parsed_start.getTime())/1000}, '*score not added*', ${desc}, ${player_one_id}, ${player_two_id})`;
    db.run(query);

    const idQuery = sql`SELECT id FROM matches ORDER BY id DESC LIMIT 1`;
    const idQueryResult = db.get(idQuery) as Array<{ id: number }>;
    const idQueryID = idQueryResult ? idQueryResult[0] : undefined;

    const cronTime = `0 ${parsed.getMinutes()} ${parsed.getHours()} ${parsed.getDate()} ${parsed.getMonth() + 1} *`;
    const cronTime2 = `0 ${parsed_start.getMinutes()} ${parsed_start.getHours()} ${parsed_start.getDate()} ${parsed_start.getMonth() + 1} *`;
    const job = new CronJob(
      cronTime, // cronTime
      async function () {
        
        await new Promise(resolve => setTimeout(resolve, 4000));

        const channelName = "ozskt4-reminders";
        const channel = interaction.guild?.channels.cache.find(channel => channel.name === channelName);

        if (channel?.isTextBased()) {
          channel.send(`**${desc}** - match nr. **${idQueryID}** - <@${playerOneResult}> vs. <@${playerTwoResult}> zaczyna się za **15** minut!`);
        }

        await interaction.editReply("Match reminder sent.");
        job.stop();
      }, // onTick
      null, // onComplete
      true, // start
      'Europe/Warsaw' // timeZone
    );
    
    const job2 = new CronJob(
      cronTime2, // cronTime
      async function () {

        await new Promise(resolve => setTimeout(resolve, 4000));

        const channelName = "ozskt4-reminders";
        const channel = interaction.guild?.channels.cache.find(channel => channel.name === channelName);

        if (channel?.isTextBased()) {
          channel.send(`**${desc}** - match nr. **${idQueryID}** - <@${playerOneResult}> vs. <@${playerTwoResult}> zaczyna się teraz!`);
        }

        await interaction.editReply("Match start sent.");
        job2.stop();
      }, // onTick
      null, // onComplete
      true, // start
      'Europe/Warsaw' // timeZone
    );
  }
} else {
  interaction.reply("Invalid date format, please try again and use 'YYYY-MM-DD hh-mm'");
}

});