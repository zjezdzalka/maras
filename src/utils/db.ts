import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { drizzle } from 'drizzle-orm/bun-sqlite'
import Database from 'bun:sqlite'

const sqlite = new Database('osu.db')
export const db = drizzle(sqlite)