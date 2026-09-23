import { getCurrentUser, saveExerciseSolution } from '@utils/progress'
import type { APIRoute } from 'astro'
import { z } from 'zod'

const bodySchema = z.object({
  exerciseId: z.string().min(1),
  /** The student's work, keyed by filename. */
  solution: z.record(z.string(), z.string()),
})

/**
 * Saves a student's work in progress without counting an attempt.
 *
 * Called as they type. Drafts also sit in localStorage for instant restore,
 * but that is per browser, so the durable copy lives here.
 */
export const POST: APIRoute = async ({ request }) => {
  const json = bodySchema.safeParse(await request.json().catch(() => null))
  if (!json.success) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const user = await getCurrentUser()
  if (!user) {
    return Response.json({ error: 'No local user is seeded. Run `yarn db:seed`.' }, { status: 404 })
  }

  await saveExerciseSolution(user.id, json.data.exerciseId, json.data.solution)
  return Response.json({ saved: true })
}
