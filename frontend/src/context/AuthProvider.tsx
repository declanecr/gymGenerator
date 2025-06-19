import React, { useState, useEffect, ReactNode} from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";



/******* PROVIDER COMPONENT********
`useEffect()` hydrates token on app load. 
`login()` writes tokens to localStorage + sets state.
`logout()` clears both.
*/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)

  // Load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('accessToken')
    if (stored) setToken(stored)
  }, [])

   // Attach auth token to each request
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers ?? {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    })

    return () => {
      api.interceptors.request.eject(requestInterceptor)
    }
  }, [token])


  const login = (newToken: string) => {
    localStorage.setItem('accessToken', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}



