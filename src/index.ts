import "dotenv/config.js";
import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import loadCommands from "./utils/load_commands.js";
import { setConfig } from "./utils/context.js";
import { eq, sql} from "drizzle-orm";
import { db } from "./utils/db.js";
import { CronJob } from 'cron';


const config = setConfig()

const rest = new REST({ version: "10" }).setToken(config.secret_token);
const commands = await loadCommands()

try {
  console.log("Started refreshing apps slash (/) commands.");

  console.log(commands)

  await rest.put(Routes.applicationCommands(config.client_id), {
    body: commands.map(e => { return e.body })
  }).catch((err) => console.log(err));

  console.log(`Successfully reloaded ${commands.length} application slash (/) commands.`);
} catch (err) {
  console.error(err);
}

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);

  // Pass the client to setupCronJobs
  setupCronJobs(client);
});

async function setupCronJobs(client: Client){
  let query = sql`SELECT * FROM matches`;
  let result = db.all(query);

  const elements =
    result.map((e: any) => {
    let date = new Date(e.date * 1000);
    let earlyDate = new Date(e.date * 1000 - 1*60000);
    // uncomment if offset necessary
    // const offset = date.getTimezoneOffset()
    // date = new Date(date.getTime() - (offset * 60 * 1000))

    console.log(date.getTime());
    console.log(earlyDate.getTime());
      

    let earlyCRON = `0 ${earlyDate.getMinutes()} ${earlyDate.getHours()} ${earlyDate.getDate()} ${earlyDate.getMonth() + 1} *`;
    let lateCRON = `0 ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()+1} *`;

    console.log(earlyCRON);
    console.log(lateCRON);

    const job = new CronJob(
      earlyCRON, // cronTime
      async function () {

        await new Promise(resolve => setTimeout(resolve, 4000));

        const channelName = "ozskt4-reminders";
        const guildID = "940585638321872896";
        const channel = client.guilds.cache.get(guildID)?.channels.cache.find(channel => channel.name === channelName);
      
        const playerOneQuery = sql`SELECT dsc_tag FROM players WHERE id = ${e.playerone_id}`;
        const playerOneTag = db.get(playerOneQuery) as Array<{ dsc_tag: string }>;
        const playerOneResult = playerOneTag ? playerOneTag[0] : undefined;

        const playerTwoQuery = sql`SELECT dsc_tag FROM players WHERE id = ${e.playertwo_id}`;
        const playerTwoTag = db.get(playerTwoQuery) as Array<{ dsc_tag: string }>;
        const playerTwoResult = playerTwoTag ? playerTwoTag[0] : undefined;

        if (channel?.isTextBased()) {
          channel.send(`**${e.desc}** - match nr. **${e.id}** - <@${playerOneResult}> vs. <@${playerTwoResult}> zaczyna się za 15 minut!`);
        }

        job.stop();
      }, // onTick
      null, // onComplete
      true, // start
      'Europe/Warsaw' // timeZone
    );

    const job2 = new CronJob(
      lateCRON, // cronTime
      async function () {

        await new Promise(resolve => setTimeout(resolve, 4000));
        const channelName = "ozskt4-reminders";
        const guildID = "940585638321872896";
        const channel = client.guilds.cache.get(guildID)?.channels.cache.find(channel => channel.name === channelName);

        const playerOneQuery = sql`SELECT dsc_tag FROM players WHERE id = ${e.playerone_id}`;
        const playerOneTag = db.get(playerOneQuery) as Array<{ dsc_tag: string }>;
        const playerOneResult = playerOneTag ? playerOneTag[0] : undefined;

        const playerTwoQuery = sql`SELECT dsc_tag FROM players WHERE id = ${e.playertwo_id}`;
        const playerTwoTag = db.get(playerTwoQuery) as Array<{ dsc_tag: string }>;
        const playerTwoResult = playerTwoTag ? playerTwoTag[0] : undefined;

        if (channel?.isTextBased()) {
          channel.send(`**${e.desc}** - match nr. **${e.id}** - <@${playerOneResult}> vs. <@${playerTwoResult}> zaczyna się teraz!`);
        }

        job2.stop();
      }, // onTick
      null, // onComplete
      true, // start
      'Europe/Warsaw' // timeZone
    );

    console.log("finished match ID: ", e.id);
  });

}

client.on("interactionCreate", async (interact) => {
  if (!interact.isChatInputCommand()) return;

  if (commands.map(a => a.body.name).includes(interact.commandName)) {
    commands.find((e) => e.body.name == interact.commandName)?.action(interact)
  }
});




client.login(config.secret_token);
