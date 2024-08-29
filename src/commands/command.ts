import { ChatInputCommandInteraction, CacheType, ApplicationCommandOptionType } from "discord.js"
type Action = (interaction: ChatInputCommandInteraction<CacheType>) => void

export default class Command {
    constructor(name: string, description: string, type: ApplicationCommandOptionType, options: Option[], fn: Action) {
        this.body = {
            name: name,
            description: description,
            type: type,
            options: options
        }
        this.action = fn
    }
    body: {
        name: string
        description: string
        options: Option[]
        type: ApplicationCommandOptionType
    }
    action: Action
}
export class Option {
    constructor(name: string, description: string, required: boolean, type: ApplicationCommandOptionType) {
        this.name = name
        this.description = description
        this.required = required
        this.type = type
    }
    name: string
    description: string
    required: boolean
    type: ApplicationCommandOptionType
}