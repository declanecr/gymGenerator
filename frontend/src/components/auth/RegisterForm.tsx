//Renders the form, validates with Zod, calls registerUser()

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextField, Button, Box } from '@mui/material'
import { registerUser } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

/* ---------- validation schema ---------- */
const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: '≥8 characters' }),
})

type RegisterInputs = z.infer<typeof schema>

export interface RegisterFormProps {
  onLoadingChange?: (loading: boolean) => void
  onError?: (message: string) => void
}

export function RegisterForm({ onLoadingChange, onError }: RegisterFormProps = {}) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: RegisterInputs) => {
    onLoadingChange?.(true)
    try {
      const { accessToken } = await registerUser(data)
      login(accessToken)          // auto-login
      navigate('/dashboard')
    } catch (err) {
      console.error('Register failed:', err)
      onError?.('Register failed')
    } finally {
      onLoadingChange?.(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Name"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
        />

        <TextField
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Registering…' : 'Create account'}
        </Button>
      </Box>
    </form>
  )
}
