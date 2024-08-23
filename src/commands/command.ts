import { ChatInputCommandInteraction, CacheType } from "discord.js"
type Action = (interaction: ChatInputCommandInteraction<CacheType>) => void

export default class Command {
    constructor(name: string, description: string, fn: Action) {
        this.name = name
        this.description = description
        this.action = fn
    }
    name: string
    description: string
    action: Action
}