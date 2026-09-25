import { getCurrentUser, recordExerciseAttempt } from '@utils/progress'
import type { APIRoute } from 'astro'
import { z } from 'zod'

const bodySchema = z.object({
  exerciseId: z.string().min(1),
  passed: z.number().int().min(0),
  total: z.number().int().min(0),
  /** The student's work, keyed by filename. */
  solution: z.record(z.string(), z.string()).optional(),
})

/**
 * Records one run of an exercise.
 *
 * A plain API route rather than an Astro action: actions are reachable from
 * forms via `?_action=`, but the `/_actions/[...path]` RPC route is not
 * registered in this configuration, so calling one from client script 404s.
 * The workspace runs checks in a Worker and posts the tally here.
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

  const { exerciseId, passed, total, solution } = json.data
  return Response.json(await recordExerciseAttempt(user.id, exerciseId, passed, total, solution))
}
