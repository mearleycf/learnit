    /**
     * Create a SeedingError instance.
     *
     * @param error - The error that occurred while seeding the database.
     * @param context - An object containing information about the error.
     *                  The object should have the following properties:
     *                  - `table`: The table that was being seeded when the
     *                    error occurred.
     *                  - `operation`: The operation that was being performed
     *                    when the error occurred. This can be 'insert',
     *                    'update', or 'delete'.
     *                  - `id`: The id of the entry that was being inserted,
     *                    updated, or deleted when the error occurred. This
     *                    property is optional and should only be provided
     *                    if the error occurred during an insert, update, or
     *                    delete operation.
     */

export class SeedingError {
    readonly _tag = 'SeedingError'
    constructor(
        readonly error: unknown,
        readonly context: {
            table: 'courses' | 'chapters' | 'sections' | 'exercises' | 'users' | 'feedback' | 'notes' | 'student_progress' | 'student_exercise_progress',
            operation: 'insert' | 'update' | 'delete'
            id?: string
        }
    ) {}
}
