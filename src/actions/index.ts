import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import { getCurrentUser, setSectionComplete } from '@utils/progress'

export const server = {
  /** Toggles a section's completed state for the local user. */
  toggleSectionComplete: defineAction({
    accept: 'form',
    input: z.object({
      courseId: z.string(),
      sectionId: z.string(),
      complete: z.union([z.literal('true'), z.literal('false')]).transform(value => value === 'true'),
    }),
    handler: async ({ courseId, sectionId, complete }) => {
      const user = await getCurrentUser()
      if (!user) throw new ActionError({ code: 'NOT_FOUND', message: 'No local user is seeded.' })

      const updated = await setSectionComplete(user.id, courseId, sectionId, complete)
      return { complete: updated }
    },
  }),
}
