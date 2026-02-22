import React from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Login(){
  const { login, user, loading } = useAuth()
  const [username, setUsername] = React.useState('test')
  const [password, setPassword] = React.useState('test')
  const [error, setError] = React.useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      await login(username, password)
      navigate(from, { replace: true })
    }catch(err){
      setError(err.message)
    }
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-slate-500">Checking authentication...</div></div>
  if(user) return <Navigate to={from} replace />

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-primary-800">CSUPER CARS CO.LTD </h1>
          {/* <p className="text-sm text-slate-500 mt-1">Freight MIS – Internal Use</p> */}
        </div>
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 shadow-card-hover">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-xs text-slate-500 mb-4">Test: username <strong>test</strong>, password <strong>test</strong></p>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Username</label>
              <input
                type="text"
                className="input-base"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <input
                type="password"
                className="input-base"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>
          <div className="mt-6">
            <button type="submit" className="btn-primary w-full py-2.5">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
