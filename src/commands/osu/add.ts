import { CacheType, ChatInputCommandInteraction } from "discord.js";
import Command from "../command.js"
import { twojastara } from "../../utils/schemas.js";
import { db } from "../../utils/db.js";

export default new Command("add", "Adds match", async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const result = await db.select().from(twojastara);
  console.log(result[0].name)
  interaction.reply(result[0].name)
});