'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/Button'
import { navigation } from '@/components/Navigation'

function PageLink({ label, page, previous = false }) {
  return (
    <>
      <Button
        href={page.href}
        aria-label={`${label}: ${page.title}`}
        variant="secondary"
        arrow={previous ? 'left' : 'right'}
      >
        {label}
      </Button>
      <Link
        href={page.href}
        tabIndex={-1}
        aria-hidden="true"
        className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
      >
        {page.title}
      </Link>
    </>
  )
}

function PageNavigation() {
  let pathname = usePathname()
  let allPages = navigation.flatMap(group => group.links)
  let currentPageIndex = allPages.findIndex(page => page.href === pathname)

  if (currentPageIndex === -1) {
    return null
  }

  let previousPage = allPages[currentPageIndex - 1]
  let nextPage = allPages[currentPageIndex + 1]

  if (!previousPage && !nextPage) {
    return null
  }

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
        </div>
      )}
    </div>
  )
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M11.1527 8.92804L16.2525 3H15.044L10.6159 8.14724L7.07919 3H3L8.34821 10.7835L3 17H4.20855L8.88474 11.5643L12.6198 17H16.699L11.1524 8.92804H11.1527ZM9.49748 10.8521L8.95559 10.077L4.644 3.90978H6.50026L9.97976 8.88696L10.5216 9.66202L15.0446 16.1316H13.1883L9.49748 10.8524V10.8521Z" />
    </svg>
  )
}

function GitHubIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.667c-4.605 0-8.334 3.823-8.334 8.544 0 3.78 2.385 6.974 5.698 8.106.417.075.573-.182.573-.406 0-.203-.011-.875-.011-1.592-2.093.397-2.635-.522-2.802-1.002-.094-.246-.5-1.005-.854-1.207-.291-.16-.708-.556-.01-.567.656-.01 1.124.62 1.281.876.75 1.292 1.948.93 2.427.705.073-.555.291-.93.531-1.143-1.854-.213-3.791-.95-3.791-4.218 0-.929.322-1.698.854-2.296-.083-.214-.375-1.09.083-2.265 0 0 .698-.224 2.292.876a7.576 7.576 0 0 1 2.083-.288c.709 0 1.417.096 2.084.288 1.593-1.11 2.291-.875 2.291-.875.459 1.174.167 2.05.084 2.263.53.599.854 1.357.854 2.297 0 3.278-1.948 4.005-3.802 4.219.302.266.563.78.563 1.58 0 1.143-.011 2.061-.011 2.35 0 .224.156.491.573.405a8.365 8.365 0 0 0 4.11-3.116 8.707 8.707 0 0 0 1.567-4.99c0-4.721-3.73-8.545-8.334-8.545Z"
      />
    </svg>
  )
}

function DiscourseIcon(props) {
  return (
    <svg viewBox="-2 -2 28 28" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0A12 12 0 0 0 0 12v11.5a.5.5 0 0 0 .5.5H12a12 12 0 0 0 0-24Zm4.73 19a6.6 6.6 0 0 1-7.48.13.62.62 0 0 0-.35-.13h-.06l-1.3.14 1-.45a7.79 7.79 0 0 0 8.17-3 6.6 6.6 0 0 0 .54-.87c0-.09.09-.17.13-.26s.22-.48.31-.73c0-.07.06-.15.08-.23a6.33 6.33 0 0 0 .25-.95 1.55 1.55 0 0 0 0-.21c0-.27.07-.53.09-.8a2.81 2.81 0 0 0 0-.29 6.76 6.76 0 0 0 0-.9v-.1a7.37 7.37 0 0 0-.11-.84 3 3 0 0 1 .22.28A6.59 6.59 0 0 1 16.73 19ZM4.84 14.75A6.58 6.58 0 0 1 9.23 4.6a6.8 6.8 0 0 1 1.1-.09 6.54 6.54 0 0 1 3.82 1.23l.29.23a6.33 6.33 0 0 0-.76-.12h-.16a8.24 8.24 0 0 0-.86 0l-.34 0q-.36 0-.72.09l-.28 0c-.32.07-.63.15-.94.25l-.25.1c-.24.09-.48.19-.71.3l-.27.14a8 8 0 0 0-.88.54 7.76 7.76 0 0 0-3 8.18l-.46 1 .13-1.31a.6.6 0 0 0-.1-.39Zm.23 4.18 1.43-3.14a.64.64 0 0 0 0-.43 6.56 6.56 0 0 1 9.58-7.46 6.58 6.58 0 0 1-7.46 9.56.61.61 0 0 0-.42 0Z"
      />
    </svg>
  )
}

function SocialLink({ href, icon: Icon, children }) {
  return (
    <Link href={href} className="group">
      <span className="sr-only">{children}</span>
      <Icon className="h-5 w-5 fill-zinc-700 transition group-hover:fill-zinc-900 dark:group-hover:fill-zinc-500" />
    </Link>
  )
}

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 sm:flex-row dark:border-white/5">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        &copy; Copyright {new Date().getFullYear()}. All rights reserved.
      </p>
      <div className="flex gap-4">
        <SocialLink href="https://x.com/inkdrop_app" icon={XIcon}>
          Follow us on X
        </SocialLink>
        <SocialLink
          href="https://github.com/inkdropapp/api-docs/"
          icon={GitHubIcon}
        >
          Follow us on GitHub
        </SocialLink>
        <SocialLink href="https://forum.inkdrop.app/" icon={DiscourseIcon}>
          Join our user forum
        </SocialLink>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <PageNavigation />
      <SmallPrint />
    </footer>
  )
}
