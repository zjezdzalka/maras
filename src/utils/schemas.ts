import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const twojastara = sqliteTable("twojastara", {
    id: text('id').notNull(),
    name: text('name').notNull(),
})

export const matches = sqliteTable("matches", {
    id: integer("id").notNull(),
    playerone_id: text("playerone_id").notNull(),
    playertwo_id: text("playertwo_id").notNull(),
    time: integer('date', { mode: 'timestamp' })
})