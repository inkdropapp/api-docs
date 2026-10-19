'use client'

import { usePathname } from 'next/navigation'

import { RobotHeadIcon } from '@/components/icons/RobotHeadIcon'
import { markdownPath } from '@/lib/markdownPath'

export function ViewMarkdownLink() {
  const href = markdownPath(usePathname())

  // A plain `<a>`: the `.md` URL is a route handler, not a page `next/link`
  // could navigate to client-side
  return (
    <>
      <link rel="alternate" type="text/markdown" href={href} />
      <a
        href={href}
        aria-label="View page as Markdown"
        className="mt-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        <RobotHeadIcon aria-hidden="true" className="h-4 w-4 flex-none" />
        <span className="hidden sm:inline">View as Markdown</span>
        <span className="sm:hidden">Markdown</span>
      </a>
    </>
  )
}
