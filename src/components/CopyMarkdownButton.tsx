'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

function ClipboardIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  )
}

type CopyState = 'idle' | 'copied' | 'error'

export function CopyMarkdownButton() {
  const pathname = usePathname()
  const [state, setState] = useState<CopyState>('idle')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (state === 'idle') return
    const timeout = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(timeout)
  }, [state])

  async function handleCopy() {
    if (loading) return
    setLoading(true)
    try {
      const response = await fetch(
        `/api/markdown?path=${encodeURIComponent(pathname)}`
      )
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      const markdown = await response.text()
      await window.navigator.clipboard.writeText(markdown)
      setState('copied')
    } catch (error) {
      console.error('Failed to copy Markdown:', error)
      setState('error')
    } finally {
      setLoading(false)
    }
  }

  const label =
    state === 'copied' ? 'Copied!' : state === 'error' ? 'Failed' : 'Copy as Markdown'

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={loading}
      aria-label="Copy page as Markdown"
      className={clsx(
        'mt-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-60',
        state === 'copied'
          ? 'text-pink-500 dark:text-pink-400'
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
      )}
    >
      <ClipboardIcon className="h-4 w-4 fill-transparent stroke-current" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{state === 'copied' ? 'Copied!' : 'Copy'}</span>
    </button>
  )
}
