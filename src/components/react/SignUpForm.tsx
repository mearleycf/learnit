import { supabase } from '@lib/supabase'
import React, { useState } from 'react'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      setMessage('Sign-up successful! Check your email for confirmation.')
      console.log('Sign-up data:', data)
    } catch (error) {
      setMessage('Error during sign-up: ' + (error as Error).message)
      console.error('Sign-up error:', error)
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  )
}
