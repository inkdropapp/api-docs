import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/guides/create-a-theme',
    name: 'Create a theme',
    description: 'A tutorial on how to create a theme.'
  },
  {
    href: '/guides/plugin-word-count',
    name: 'Create a plugin',
    description: 'A tutorial on how to create a plugin.'
  },
  {
    href: '/guides/access-the-local-database',
    name: 'Access the database',
    description:
      'Learn how to access the local database from plugins and external programs.'
  },
  {
    href: '/guides/create-a-blog-using-astro',
    name: 'Create a blog using Astro',
    description: 'A tutorial on how to create a blog using Astro.'
  }
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map(guide => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
