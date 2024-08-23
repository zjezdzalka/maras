import Database from "bun:sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { drizzle } from "drizzle-orm/bun-sqlite"

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite);
await migrate(db, { migrationsFolder: './drizzle' })