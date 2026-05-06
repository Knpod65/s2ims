'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Role, User } from './types'
import { mockUsers } from '../data/mock/users'

interface AuthContextValue {
  user: User | null
  role: Role | null
  login: (role: Role) => void
  logout: () => void
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null, role: null, login: () => {}, logout: () => {}, isLoaded: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('s2ims_role') as Role | null
    if (saved) {
      const u = mockUsers.find(u => u.role === saved)
      if (u) setUser(u)
    }
    setIsLoaded(true)
  }, [])

  const login = (role: Role) => {
    const u = mockUsers.find(u => u.role === role)
    if (u) {
      setUser(u)
      localStorage.setItem('s2ims_role', role)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('s2ims_role')
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, login, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
