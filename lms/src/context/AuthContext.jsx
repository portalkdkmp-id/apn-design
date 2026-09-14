import { createContext, useContext, useMemo, useState } from 'react'
import { authenticate, homePathForRole } from '../data/auth'

const STORAGE_KEY = 'apn_auth_user'
const AuthContext = createContext(null)

function readStoredUser() {
  if (typeof sessionStorage === 'undefined' && typeof localStorage === 'undefined') return null

  try {
    const rawSession = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY) : null
    if (rawSession) return JSON.parse(rawSession)

    const rawLocal = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return rawLocal ? JSON.parse(rawLocal) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  if (typeof sessionStorage === 'undefined') return

  if (user) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  } else {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const login = ({ login, password }) => {
    setIsLoggingOut(false)
    const result = authenticate({ login, password })
    if (result.user) {
      setUser(result.user)
      persistUser(result.user)
    }
    return result
  }

  const logout = () => {
    setIsLoggingOut(true)
    setUser(null)
    persistUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoggingOut,
      login,
      logout,
      hasRole: (role) => {
        if (!user) return false
        return Array.isArray(role) ? role.includes(user.role) : user.role === role
      },
      can: (permission) => Boolean(user?.permissions?.includes(permission)),
      homePath: user ? homePathForRole(user.role) : '/login',
    }),
    [user, isLoggingOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }
  return context
}
