import React from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = React.createContext(null)

export function useAuth(){
  return React.useContext(AuthContext)
}

export default function AuthProvider({ children }){
  const initialToken = localStorage.getItem('carizo_token') || ''
  const [token, setToken] = React.useState(() => initialToken)
  const [user, setUser] = React.useState(null)
  // If we have a token at startup, treat auth as loading until we verify it
  const [loading, setLoading] = React.useState(() => !!initialToken)
  const navigate = useNavigate()

  // Prefer explicit VITE_API_BASE; fall back to localhost backend so dev requests
  // hit the FastAPI server instead of the Vite dev server when env isn't set.
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

  React.useEffect(()=>{
    if(token){
      fetchCurrentUser(token)
    } else {
      setUser(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  async function fetchCurrentUser(t){
    setLoading(true)
    try{
  const url = `${API_BASE}/users/me`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${t}` }})
      if(!res.ok){
        // Only clear token if it's explicitly invalid (unauthorized/forbidden).
        if(res.status === 401 || res.status === 403){
          setUser(null)
          setToken('')
          localStorage.removeItem('carizo_token')
        } else {
          // For other errors (5xx, network hiccups), keep the token and allow retry.
          console.error('fetchCurrentUser non-OK response', res.status)
          setUser(null)
        }
        setLoading(false)
        return
      }
      const data = await res.json()
      setUser(data)
    }catch(err){
      console.error('fetchCurrentUser error', err)
      // Network error: don't remove the stored token here — it may still be valid.
      setUser(null)
    }finally{
      setLoading(false)
    }
  }

  async function login(username, password){
    const form = new URLSearchParams()
    form.append('username', username)
    form.append('password', password)
    const url = `${API_BASE}/auth/token`
  const res = await fetch(url, { method: 'POST', body: form, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if(!res.ok){
      const err = await res.json().catch(()=>({ detail: 'Login failed' }))
      throw new Error(err.detail || 'Login failed')
    }
    const data = await res.json()
    setToken(data.access_token)
    localStorage.setItem('carizo_token', data.access_token)
    // fetchCurrentUser will run via effect
    return data
  }

  function logout(){
    setToken('')
    setUser(null)
    localStorage.removeItem('carizo_token')
    navigate('/', { replace: true })
  }

  const value = { token, user, loading, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
