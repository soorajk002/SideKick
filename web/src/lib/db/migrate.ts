import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// Next.js and tsx automatically load .env files, no need for dotenv

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

async function main() {
  console.log('Starting migration...')

  const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 })
  const db = drizzle(migrationClient)

  await migrate(db, { migrationsFolder: './drizzle' })

  await migrationClient.end()

  console.log('Migration completed successfully!')
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
