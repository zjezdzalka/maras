import { defineConfig } from 'drizzle-kit'
export default defineConfig({
    schema: './src/utils/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
})