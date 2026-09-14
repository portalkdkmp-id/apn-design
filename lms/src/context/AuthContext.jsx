import { createContext, useContext, useMemo, useState } from 'react'
import { authenticate, homePathForRole } from '../data/auth'

const STORAGE_KEY = 'apn_auth_user'
const AuthContext = createContext(null)

function readStoredUser() {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  if (typeof localStorage === 'undefined') return
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  const login = ({ login, password }) => {
    const result = authenticate({ login, password })
    if (result.user) {
      setUser(result.user)
      persistUser(result.user)
    }
    return result
  }

  const logout = () => {
    setUser(null)
    persistUser(null)
  }

  const updateUser = (patch) => {
    setUser((current) => {
      if (!current) return current
      const next = { ...current, ...patch }
      persistUser(next)
      return next
    })
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
      hasRole: (role) => {
        if (!user) return false
        return Array.isArray(role) ? role.includes(user.role) : user.role === role
      },
      can: (permission) => Boolean(user?.permissions?.includes(permission)),
      homePath: user ? homePathForRole(user.role) : '/login',
    }),
    [user],
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
