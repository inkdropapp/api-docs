import glob from 'fast-glob'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { markdownPath } from '@/lib/markdownPath'
import { mdxMetadata, mdxToMarkdown } from '@/lib/mdxToMarkdown'
import { navigation } from '@/lib/navigation'

export const SITE_URL = 'https://developers.inkdrop.app'

const APP_DIR = path.join(process.cwd(), 'src', 'app')

function pagePath(slug: Array<string>) {
  return `/${slug.join('/')}`
}

async function readPage(slug: Array<string>) {
  let source = await readFile(path.join(APP_DIR, ...slug, 'page.mdx'), 'utf8')
  return source.replace(/\r\n?/g, '\n')
}

export async function getMarkdownSlugs() {
  let files = await glob('**/page.mdx', { cwd: APP_DIR })
  return files.map(file => file.split('/').slice(0, -1))
}

export async function getPageMarkdown(slug: Array<string>) {
  let markdown = await mdxToMarkdown(await readPage(slug), {
    origin: SITE_URL,
    pagePath: pagePath(slug)
  })

  // Pages bring their own `# Title` and lead paragraph, so only the source URL
  // goes right below the title
  let info = `Source: ${SITE_URL}${pagePath(slug)}`
  let match = markdown.match(/^# .*\n/m)
  if (!match || match.index == null) return `${info}\n\n${markdown}`
  let end = match.index + match[0].length
  return `${markdown.slice(0, end)}\n${info}\n${markdown.slice(end)}`
}

async function linkItem(slug: Array<string>, title?: string) {
  let page = mdxMetadata(await readPage(slug))
  let item = `- [${title ?? page.title ?? slug.join('/')}](${SITE_URL}${markdownPath(pagePath(slug))})`
  return page.description ? `${item}: ${page.description}` : item
}

function toSlug(href: string) {
  return href.split('/').filter(Boolean)
}

// Index of all pages following the llms.txt convention (https://llmstxt.org)
export async function getLlmsTxt() {
  let listed = new Set<string>()
  let sections = await Promise.all(
    navigation.map(async group => {
      let links = group.link
        ? [{ title: 'Overview', href: group.link }, ...group.links]
        : group.links
      let items = await Promise.all(
        links.map(link => {
          listed.add(link.href)
          return linkItem(toSlug(link.href), link.title)
        })
      )
      return `## ${group.title}\n\n${items.join('\n')}`
    })
  )

  let slugs = await getMarkdownSlugs()
  let others = await Promise.all(
    slugs
      .filter(slug => !listed.has(pagePath(slug)))
      .map(slug => linkItem(slug))
  )
  if (others.length > 0) {
    sections.push(`## Optional\n\n${others.sort().join('\n')}`)
  }

  sections.push(
    [
      '## Further Resources\n',
      '- [User manual](https://docs.inkdrop.app/): Learn how to use Inkdrop',
      '- [User forum](https://forum.inkdrop.app/): Join discussions, get help, and share app insights',
      '- [Plugins](https://my.inkdrop.app/plugins): Browse community plugins'
    ].join('\n')
  )

  return [
    '# Inkdrop API Reference',
    '> Developer documentation for Inkdrop - a Markdown note-taking app built for developers. Covers customizing the app with the init file and style tweaks, building plugins and themes, and the APIs for the local database, core modules, app states, actions and UI components.',
    `Every page is available as Markdown by appending \`.md\` to its URL. The full documentation in a single file: ${SITE_URL}/llms-full.txt`,
    ...sections
  ]
    .join('\n\n')
    .concat('\n')
}

// Every page's Markdown concatenated into a single document
export async function getLlmsFullTxt() {
  // In navigation order, so the guides come before the API references, with
  // pages missing from the navigation at the end
  let order = navigation.flatMap(group =>
    [group.link, ...group.links.map(link => link.href)].filter(Boolean)
  )
  let rank = (slug: Array<string>) => {
    let index = order.indexOf(pagePath(slug))
    return index === -1 ? order.length : index
  }
  let slugs = await getMarkdownSlugs()
  let pages = await Promise.all(
    slugs
      .sort(
        (a, b) => rank(a) - rank(b) || a.join('/').localeCompare(b.join('/'))
      )
      .map(getPageMarkdown)
  )
  return pages.join('\n---\n\n')
}
