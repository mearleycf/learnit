import { useAuth } from '@lib/auth'
import React from 'react'

export function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to view this content.</div>
  }

  return <>{children}</>
}
