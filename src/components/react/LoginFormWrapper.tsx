import LoginForm from '@components/react/LoginForm'
import { AuthProvider } from '@lib/auth'
import React from 'react'

export default function LoginFormWrapper() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
