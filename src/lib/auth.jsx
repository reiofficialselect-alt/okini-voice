import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSCODE || 'admin1234'
const CAST_PASS = import.meta.env.VITE_CAST_PASSCODE || 'cast5678'

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => sessionStorage.getItem('okini_role') || null)
  const [lineUser, setLineUser] = useState(() => {
    const saved = sessionStorage.getItem('okini_line_user')
    return saved ? JSON.parse(saved) : null
  })

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

  const loginWithLine = useCallback((data) => {
    setRole('cast')
    setLineUser(data.profile)
    sessionStorage.setItem('okini_role', 'cast')
    sessionStorage.setItem('okini_line_user', JSON.stringify(data.profile))
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    setLineUser(null)
    sessionStorage.removeItem('okini_role')
    sessionStorage.removeItem('okini_line_user')
  }, [])

  return (
    <AuthContext.Provider value={{ role, login, loginWithLine, logout, lineUser, isAdmin: role === 'admin', isCast: role === 'cast', isAuth: !!role }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)