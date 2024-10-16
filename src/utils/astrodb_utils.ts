import { db, sql } from 'astro:db'

export async function setupConstraints() {
  // Implement any additional constraints here
}

export async function updateTimestamp(table: string, id: string | number) {
  await db.run(sql`
        UPDATE ${sql.identifier(table)}
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
    `)
}
