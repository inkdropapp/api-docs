'use client'
import Link from 'next/link'

export function Feedback() {
  return (
    <div className="relative pl-4 pt-2 border-l-4 border-yellow-400 dark:border-yellow-600">
      <div className="">Can you help us improve the docs? 🙏</div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The source of these docs is{' '}
        <Link
          href="https://github.com/inkdropapp/api-docs"
          className="inline-block py-1 text-sm text-pink-600 transition hover:text-pink-900 dark:text-pink-400 dark:hover:text-white"
        >
          here on GitHub
        </Link>
        . If you see a way these docs can be improved, please fork us!
      </p>
    </div>
  )
}
