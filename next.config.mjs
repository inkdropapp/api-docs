import nextMDX from '@next/mdx'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins
  }
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
    '/**/*': ['./src/app/**/*.mdx']
  },
  // Serve a plain Markdown version of every page at `<path>.md` for agents
  async rewrites() {
    return [
      { source: '/index.md', destination: '/raw-md' },
      { source: '/:path+.md', destination: '/raw-md/:path+' }
    ]
  }
}

export default withSearch(withMDX(nextConfig))
