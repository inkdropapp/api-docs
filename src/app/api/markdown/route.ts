import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { mdxToMarkdown } from '@/lib/mdxToMarkdown'

const APP_DIR = path.join(process.cwd(), 'src', 'app')

/** Normalizes the `path` query param to a clean absolute page path like `/states/db`. */
function normalizePagePath(raw: string | null): string | null {
  if (raw == null || raw === '' || raw === '/') return '/'
  // Allow only safe characters and reject any traversal attempt.
  if (!/^\/[\w\-/]*$/.test(raw) || raw.includes('..')) return null
  return raw.replace(/\/+$/, '') || '/'
}

/** Resolves a page path to its `page.mdx` file, ensuring it stays within src/app. */
function resolveMdxFile(pagePath: string): string | null {
  const relative = pagePath === '/' ? 'page.mdx' : `${pagePath.slice(1)}/page.mdx`
  const filePath = path.join(APP_DIR, relative)
  if (filePath !== APP_DIR && !filePath.startsWith(APP_DIR + path.sep)) {
    return null
  }
  return filePath
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const pagePath = normalizePagePath(url.searchParams.get('path'))

  if (!pagePath) {
    return new Response('Invalid path', { status: 400 })
  }

  const filePath = resolveMdxFile(pagePath)
  if (!filePath) {
    return new Response('Invalid path', { status: 400 })
  }

  let source: string
  try {
    source = await readFile(filePath, 'utf8')
  } catch {
    return new Response('Not found', { status: 404 })
  }

  try {
    const markdown = await mdxToMarkdown(source, { origin: url.origin, pagePath })
    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Failed to convert MDX to Markdown:', error)
    return new Response('Failed to render Markdown', { status: 500 })
  }
}
