import { db, sql } from 'astro:db'

export async function setupConstraints() {
  await db.run(sql`
        ALTER TABLE Sections ADD CONSTRAINT check_access_level CHECK (access_level IN ('purchased', 'free'));
        ALTER TABLE Exercises ADD CONSTRAINT check_difficulty CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'));
        ALTER TABLE Feedback ADD CONSTRAINT check_status CHECK (status IN ('pending', 'reviewed', 'resolved', 'ignored'));
        ALTER TABLE Feedback ADD CONSTRAINT check_rating CHECK (rating BETWEEN 0 AND 5);
        ALTER TABLE Feedback ADD CONSTRAINT check_category CHECK (category IN ('incorrect_content', 'general_feedback', 'technical_issue', 'feature_request', 'clarity_improvement', 'typo_or_grammar'));
        ALTER TABLE Users ADD CONSTRAINT check_role CHECK (role IN ('student', 'author', 'course_admin', 'app_admin'));
    `)
}

export async function updateTimestamp(table: string, id: string | number) {
  await db.run(sql`
        UPDATE ${sql.identifier(table)}
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
    `)
}

export async function calculateExpirationDate(
  purchaseDate: Date,
  purchaseActiveLength: number | null,
): Promise<Date | null> {
  if (purchaseActiveLength === null) {
    return null
  }
  const expirationDate = new Date(purchaseDate)
  expirationDate.setDate(expirationDate.getDate() + purchaseActiveLength)
  return expirationDate
}
