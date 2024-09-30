import { defineMiddleware } from 'astro/middleware'
import { supabase } from '@lib/supabase'

export const authMiddleware = defineMiddleware(async ({ locals, url }, next) => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return next()
  }

  locals.session = data.session

  if (!locals.session && !url.pathname.startsWith('/login')) {
    return Response.redirect(`${url.origin}/login`)
  }

  return next()
})
