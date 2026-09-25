import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'

/**
 * libSQL connection string.
 *
 * Local development defaults to a file-backed database in the repo root.
 * For a hosted database (Turso or self-hosted libSQL) set `DATABASE_URL` to the
 * remote URL and `DATABASE_AUTH_TOKEN` to its token.
 */
const url = process.env.DATABASE_URL ?? 'file:./local.db'
const authToken = process.env.DATABASE_AUTH_TOKEN

export const client = createClient(authToken ? { url, authToken } : { url })

export const db = drizzle(client, { schema })

export { schema }
export type Database = typeof db
