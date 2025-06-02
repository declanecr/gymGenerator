// Hook to access AuthContext
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
/*******CUSTOM HOOK -- FOR EASY ACCESS*********
 lets `const { login } = useAuth()` be used anywhere without boilerplate
 */

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}