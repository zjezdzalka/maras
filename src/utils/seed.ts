import { eq } from "drizzle-orm";
import { db } from "./db.js";
import * as schema from './schema.js'
console.log(`Seeding started.`)

const time = Date.now()

await db.insert(schema.players).values([
    {
        osu_id: 172437,
        name: "Dracula",
        discord_tag: "alucards_dad"
    },
    {
        osu_id: 696969,
        name: "Pig",
        discord_tag: "missing_jigsaw"
    },
    {
        osu_id: 161616,
        name: "-null-",
        discord_tag: "i_hate_atlas"
    },
])

await db.insert(schema.matches).values([
    {
        time: new Date("2023-08-28T17:30"),

        playerone_id: (await db.select({
            id: schema.players.id
        })
            .from(schema.players)
            .where(eq(schema.players.name, "Pig"))
            .limit(1))[0].id,


        playertwo_id: (await db.select({
            id: schema.players.id
        })
            .from(schema.players)
            .where(eq(schema.players.name, "-null-"))
            .limit(1))[0].id,
    }, {
        time: new Date("2023-08-20T23:30"),

        playerone_id: (await db.select({
            id: schema.players.id
        })
            .from(schema.players)
            .where(eq(schema.players.name, "-null-"))
            .limit(1))[0].id,


        playertwo_id: (await db.select({
            id: schema.players.id
        })
            .from(schema.players)
            .where(eq(schema.players.name, "Dracula"))
            .limit(1))[0].id,
    },
]);

console.log(`Seeding complete, took ${Date.now() - time} ms`)