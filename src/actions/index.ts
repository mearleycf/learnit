import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import { createNote, deleteNote } from '@utils/notes'
import { getCurrentUser, setSectionComplete } from '@utils/progress'

/** Resolves the local student, or fails the action if seeding never ran. */
const requireUser = async () => {
  const user = await getCurrentUser()
  if (!user) throw new ActionError({ code: 'NOT_FOUND', message: 'No local user is seeded. Run `yarn db:seed`.' })
  return user
}

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
      const user = await requireUser()
      return { complete: await setSectionComplete(user.id, courseId, sectionId, complete) }
    },
  }),

  addNote: defineAction({
    accept: 'form',
    input: z.object({
      sectionId: z.string(),
      markdown: z.string().trim().min(1, 'A note needs some text.').max(10_000),
      quote: z.string().trim().max(2_000).optional(),
    }),
    handler: async ({ sectionId, markdown, quote }) => {
      const user = await requireUser()
      await createNote(user.id, sectionId, markdown, quote || undefined)
      return { added: true }
    },
  }),

  removeNote: defineAction({
    accept: 'form',
    input: z.object({ noteId: z.string() }),
    handler: async ({ noteId }) => {
      const user = await requireUser()
      await deleteNote(user.id, noteId)
      return { removed: true }
    },
  }),
}
