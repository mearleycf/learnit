import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro:schema'

import { FEEDBACK_CATEGORIES, FEEDBACK_STATUSES } from '@schemas/feedback.schema'
import { createFeedback, setFeedbackStatus } from '@utils/feedback'
import { createNote, deleteNote, updateNote } from '@utils/notes'
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

  reportFeedback: defineAction({
    accept: 'form',
    input: z.object({
      sectionId: z.string(),
      markdown: z.string().trim().min(1, 'Describe the problem first.').max(10_000),
      category: z.enum(FEEDBACK_CATEGORIES),
      rating: z.coerce.number().int().min(1).max(5).optional(),
    }),
    handler: async ({ sectionId, markdown, category, rating }) => {
      const user = await requireUser()
      await createFeedback(user.id, sectionId, markdown, category, rating)
      return { reported: true }
    },
  }),

  updateFeedbackStatus: defineAction({
    accept: 'form',
    input: z.object({
      feedbackId: z.string(),
      status: z.enum(FEEDBACK_STATUSES),
    }),
    handler: async ({ feedbackId, status }) => {
      await requireUser()
      await setFeedbackStatus(feedbackId, status)
      return { status }
    },
  }),

  editNote: defineAction({
    accept: 'form',
    input: z.object({
      noteId: z.string(),
      markdown: z.string().trim().min(1, 'A note needs some text.').max(10_000),
    }),
    handler: async ({ noteId, markdown }) => {
      const user = await requireUser()
      await updateNote(user.id, noteId, markdown)
      return { edited: true }
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
