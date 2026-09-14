import { useSyncExternalStore } from 'react'

const THEME_KEY = 'theme'
const initialDark = typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY) === 'dark'
let currentDark = initialDark
const listeners = new Set()

function emit(nextDark) {
  currentDark = Boolean(nextDark)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_KEY, currentDark ? 'dark' : 'light')
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', currentDark)
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentDark
}

export function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const setTheme = (nextDark) => {
    emit(nextDark)
  }

  const toggleTheme = () => {
    emit(!currentDark)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark)
  }

  return {
    dark,
    setTheme,
    toggleTheme,
  }
}
