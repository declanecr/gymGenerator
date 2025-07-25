/*
This is a presentational + logic component that:
    Renders a login form with inputs (email, password)
    Uses React Hook Form to manage input state
    Uses Zod to validate inputs on submit
    Calls a passed-in onSubmit function (which handles API logic externally)
*/
import * as React from "react";
import { useForm } from "react-hook-form"; //gives RHF form state tooks (register, handleSubmit, etc)
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, Button, Box } from '@mui/material'
import { loginUser } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";



// ZOD SCHEMA - defines what VALID inputs look like 
// and what messages to show if invalid
    // *NOTE:* RHF uses these messages automcatically through its RESOLVER
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// infer TypeScript type from Zod Schema
type LoginFormInputs = z.infer<typeof loginSchema>


export interface LoginFormProps {
  onLoadingChange?: (loading: boolean) => void
  onError?: (message: string) => void
}

export function LoginForm({ onLoadingChange, onError }: LoginFormProps = {}) {    const { login } = useAuth()
    const navigate = useNavigate()

    // Set up useForm() hook
    const {
        register,   //connects input fields to RHF
        handleSubmit,   //wraps the submit function
        formState: {errors, isSubmitting }, // {holds Zod-generated validation errors, useful for loading states}
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    })

    //Define submit handler
    const onSubmit = async (data: LoginFormInputs) => {
        onLoadingChange?.(true)
        try {
            const { accessToken } = await loginUser(data)
            login(accessToken)      // Store in context + localStorage
            console.log ('Token', accessToken)
            navigate('/dashboard')    //redirect to main app view
        } catch (err) {
            console.error('Login failed', err)
            onError?.('Login failed')
        } finally {
            onLoadingChange?.(false)
        
        }
    }

    

    /* JSX Form Layout with MUI
        register('email') wires the input into RHF
        helperText and error show validation feedback
        isSubmitting disables button while submitting
    */
   return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={2}>

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
                {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

            </Box>
        </form>
   )
}