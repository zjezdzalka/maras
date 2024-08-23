import { db } from "./db.js";
import * as schema from './schemas.js'

await db.insert(schema.twojastara).values([
    {
        id: "hellow",
        name: "how you've been"
    },
    {
        id: "im the voide",
        name: "in your head"
    },
    {
        id: "and i know",
        name: "you've been"
    },
    {
        id: "aching",
        name: "eyeah"
    },
])

console.log(`Seeding comeplete.`)