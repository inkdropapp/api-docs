'use client'

import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ThemeWatcher />
      {children}
    </ThemeProvider>
  )
}
