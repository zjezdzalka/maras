import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";
import { ChatInputCommandInteraction, CacheType } from 'discord.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


type RESTCommand = {
    name: string;
    description: string;
    action: (interaction: ChatInputCommandInteraction<CacheType>) => void
}

export default async function loadCommands(): Promise<RESTCommand[]> {
    return new Promise<RESTCommand[]>(async (resolve, reject) => {
        var commands: RESTCommand[] = [];

        let files = fs.readdirSync(__dirname + "/../commands/osu", { recursive: true })

        for (const file of files) {
            if (typeof file === "string") {
                if (file.endsWith(".ts")) {
                    const module = await import("../commands/osu/" + file)
                    commands.push({
                        name: module.default.name,
                        description: module.default.description,
                        action: module.default.action
                    })
                }
            }
        }
        resolve(commands)
    })
}

