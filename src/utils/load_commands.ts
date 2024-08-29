import * as fs from 'fs'
import path from 'path'
import { fileURLToPath } from "url";
import { ChatInputCommandInteraction, CacheType } from 'discord.js'
import Command, { Option } from '../commands/command.js';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default async function loadCommands(): Promise<Command[]> {
    return new Promise<Command[]>(async (resolve, reject) => {
        var commands: Command[] = [];

        let files = fs.readdirSync(__dirname + "/../commands/osu", { recursive: true })

        for (const file of files) {
            if (typeof file === "string") {
                if (file.endsWith(".ts")) {
                    const module = await import("../commands/osu/" + file)
                    commands.push(module.default)
                }
            }
        }
        resolve(commands)
    })
}

