import { useState, useEffect } from 'react'

// Simple hook to persist state to localStorage. Small, well-commented and typed by convention.
export default function useLocalStorage(key, initialValue){
  const [state, setState] = useState(() => {
    try{
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    }catch(err){
      console.warn('useLocalStorage parse error', err)
      return initialValue
    }
  })

  useEffect(()=>{
    try{
      localStorage.setItem(key, JSON.stringify(state))
    }catch(err){
      // localStorage may be unavailable in some contexts
    }
  },[key, state])

  return [state, setState]
}
