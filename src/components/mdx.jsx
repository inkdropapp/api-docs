import Link from 'next/link'
import clsx from 'clsx'

import { Feedback } from '@/components/Feedback'
import { Heading } from '@/components/Heading'
import { Prose } from '@/components/Prose'

function ExternalIcon(props) {
  return (
    <svg strokeWidth="1.5" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.25 14.523L23.25.75M23.25 8.621V.75h-8M12.125 5.75h-10.5a.875.875 0 00-.875.875v15.75a.875.875 0 00.875.875h15.75a.875.875 0 00.875-.875v-10.5"
      ></path>
    </svg>
  )
}

export const a = function a(props) {
  const { href, ...rest } = props
  const isInternal = href && !href.startsWith('https:')

  if (isInternal) {
    return <Link {...props} />
  } else {
    return (
      <Link
        target="_blank"
        rel="noopener noreferrer"
        {...props}
        className={`${props.className || ''} my-0 inline-flex items-center`}
      >
        {props.children}
        <ExternalIcon className="ml-1 inline-block h-3 w-3" />
      </Link>
    )
  }
}

export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'

export function wrapper({ children }) {
  return (
    <article className="flex h-full flex-col pb-10 pt-16">
      <Prose className="flex-auto">{children}</Prose>
      <footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
        <Feedback />
      </footer>
    </article>
  )
}

export const h2 = function H2(props) {
  return <Heading level={2} {...props} />
}

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

export function Note({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

function WarnIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 1.5l-11 21h22l-11-21z"
        className="fill-orange-500 dark:fill-orange-200/20"
      ></path>
      <path
        fillRule="evenodd"
        d="M11 10v6h2v-6h-2zm0 8v2h2v-2h-2z"
        clipRule="evenodd"
        className="fill-white dark:fill-orange-200"
      ></path>
    </svg>
  )
}

export function Warning({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-orange-500/20 bg-orange-50/50 p-4 leading-6 text-orange-900 dark:border-orange-500/30 dark:bg-orange-500/5 dark:text-orange-200 dark:[--tw-prose-links:theme(colors.white)] dark:[--tw-prose-links-hover:theme(colors.orange.300)]">
      <WarnIcon className="mt-1 h-5 w-5 flex-none" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({ children, sticky = false }) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children, sub }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className={
          'm-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5 ' +
          (sub
            ? 'rounded-2xl border border-zinc-900/5 p-3 dark:border-white/5'
            : '')
        }
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({ name, type, required, children }) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        {required && (
          <dd className="text-xs text-pink-400 dark:text-pink-600">Required</dd>
        )}
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}
