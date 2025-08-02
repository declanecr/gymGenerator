// *****CONTEXT COMPONENT******
//set up a "context", and what it will provide
export interface AuthContextType {
    token: string | null
    login: (token: string) => void
    logout: ()=>void
    isAuthenticated: boolean
}

import { createContext } from "react"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
