import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSCODE || 'admin1234'
const CAST_PASS = import.meta.env.VITE_CAST_PASSCODE || 'cast5678'

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => sessionStorage.getItem('okini_role') || null)

  const login = useCallback((passcode) => {
    if (passcode === ADMIN_PASS) {
      setRole('admin')
      sessionStorage.setItem('okini_role', 'admin')
      return 'admin'
    }
    if (passcode === CAST_PASS) {
      setRole('cast')
      sessionStorage.setItem('okini_role', 'cast')
      return 'cast'
    }
    return null
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    sessionStorage.removeItem('okini_role')
  }, [])

  return (
    <AuthContext.Provider value={{ role, login, logout, isAdmin: role === 'admin', isCast: role === 'cast', isAuth: !!role }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
