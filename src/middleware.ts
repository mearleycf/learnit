import { checkAccess } from '@lib/auth-middleware.ts'
import { defineMiddleware } from 'astro:middleware'
import type { AstroGlobal } from 'astro'

export const onRequest = defineMiddleware(async ({ locals, request }, next) => {
  // Perform authentication check
  const user = await authenticateUser(request)
  if (user) {
    // TypeScript doesn't know about locals.user, so we need to use type assertion
    ;(locals as any).user = user
  }

  // Check access for protected routes
  if (request.url.includes('/admin') && !(await checkAccess((locals as any).user, 'admin', 'read'))) {
    return new Response('Unauthorized', { status: 401 })
  }

  return next()
})

async function authenticateUser(request: Request): Promise<any | null> {
  // Implement user authentication logic
  // For now, return null to indicate no user is authenticated
  return null
}
