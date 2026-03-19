import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ngoconnect_auth'

const readInitialAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    if (typeof window === 'undefined') return null
    return readInitialAuth()
  })

  useEffect(() => {
    try {
      if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage issues
    }
  }, [auth])

  const isAuthenticated = Boolean(auth)

  const value = useMemo(() => ({
    auth,
    isAuthenticated,
    userType: auth?.userType,
    login: ({ userType, user }) => setAuth({ userType, user }),
    logout: () => setAuth(null),
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
