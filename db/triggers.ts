import { db, sql } from 'astro:db'

export async function createTriggers() {
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_users_updated_at
            AFTER UPDATE ON users
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_courses_updated_at
            AFTER UPDATE ON courses
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_chapters_updated_at
            AFTER UPDATE ON chapters
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_sections_updated_at
            AFTER UPDATE ON sections
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_exercises_updated_at
            AFTER UPDATE ON exercises
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_feedback_updated_at
            AFTER UPDATE ON feedback
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_users_updated_at
            AFTER UPDATE ON users
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
            AFTER UPDATE ON notes
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_user_progress_updated_at
            AFTER UPDATE ON user_progress
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
  await db.execute(sql`
            CREATE TRIGGER IF NOT EXISTS update_user_exercise_progress_updated_at
            AFTER UPDATE ON user_exercise_progress
            FOR EACH ROW
            BEGIN
                UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
            END;
        `)
}
