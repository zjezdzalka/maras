import "dotenv/config";
import { REST, Routes, Client, GatewayIntentBits } from "discord.js";
import loadCommands from "./utils/load_commands.js";
import { setConfig } from "./utils/context.js";


const config = setConfig()

const rest = new REST({ version: "10" }).setToken(config.secret_token);
const commands = await loadCommands()

try {
  console.log("Started refreshing apps slash (/) commands.");


  await rest.put(Routes.applicationCommands(config.client_id), {
    body: commands.map(e => { return { name: e.name, description: e.description } })
  });

  console.log(`Successfully reloaded ${commands.length} application slash (/) commands.`);
} catch (err) {
  console.error(err);
}

const client = new Client({ intents: GatewayIntentBits.Guilds });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interact) => {
  if (!interact.isChatInputCommand()) return;

  if (commands.map(a => a.name).includes(interact.commandName)) {
    commands.find((e) => e.name == interact.commandName)?.action(interact)
  }
});




client.login(config.secret_token);
