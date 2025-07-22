'use client'

import { useState, useEffect, Dispatch, SetStateAction } from 'react'

const isBrowser = typeof window !== 'undefined'

type Response<T> = [T, Dispatch<SetStateAction<T>>]

function isJsonString(str: string) {
  try {
    JSON.parse(str)
  } catch {
    return false
  }
  return true
}

function usePersistedState<T>(key: string, initialState: T): Response<T> {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    if (!isBrowser) return

    // mount: load persisted value once
    const storageValue = window.localStorage.getItem(key)
    if (storageValue !== null) {
      const parsed = isJsonString(storageValue)
        ? JSON.parse(storageValue)
        : storageValue
      setState(parsed)
    }
  }, []) // run once

  // persist on state change
  useEffect(() => {
    if (!isBrowser) return
    if (state === undefined) return

    if (typeof state === 'string') {
      window.localStorage.setItem(key, state)
    } else {
      window.localStorage.setItem(key, JSON.stringify(state))
    }
  }, [key, state])

  return [state, setState]
}

export default usePersistedState
