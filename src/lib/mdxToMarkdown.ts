import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'

import { guides } from '@/lib/guides'
import { navigation } from '@/lib/navigation'
import { resources } from '@/lib/resources'

/**
 * Converts an MDX source string into clean GitHub-Flavored Markdown:
 * strips imports/exports and `{{ … }}` annotations, unwraps the custom JSX
 * components used throughout the docs, and rewrites relative links/images to
 * absolute URLs so the result is self-contained when pasted elsewhere.
 * An MDX component the converter doesn't know throws, so a new component can't
 * silently drop content from the Markdown output.
 */

// mdast/mdxast nodes are loosely typed here; we only touch a handful of fields.
interface MdNode {
  type: string
  children?: MdNode[]
  value?: string
  url?: string
  meta?: string | null
  depth?: number
  name?: string | null
  attributes?: MdxAttribute[]
  [key: string]: unknown
}

interface MdxAttribute {
  type: string
  name?: string
  value?: string | { type: string; value: string } | null
}

interface TransformOptions {
  /** Origin used to absolutize root-relative URLs, e.g. `https://developers.inkdrop.app`. */
  origin: string
  /** Absolute path of the page being rendered, e.g. `/event-subscription/emitter`. */
  pagePath: string
}

function makeResolveUrl({ origin, pagePath }: TransformOptions) {
  const base = `${origin}${pagePath}`

  return function resolveUrl(url: string | undefined): string | undefined {
    if (!url) return url
    // Leave external links, anchors, protocol-relative URLs untouched.
    if (/^(https?:|mailto:|tel:|#)/i.test(url) || url.startsWith('//')) {
      return url
    }
    if (url.startsWith('/')) return `${origin}${url}`
    try {
      return new URL(url, base).toString()
    } catch {
      return url
    }
  }
}

/** Reads a string property out of a `{{ key: '…' }}` annotation expression. */
function readAnnotation(source: string, key: string): string | undefined {
  const match = new RegExp(`\\b${key}\\s*:\\s*(['"])(.*?)\\1`).exec(source)
  return match?.[2]
}

/**
 * Builds a heading's signature out of its `{{ tag: 'GET', label: '/notes' }}`
 * annotation, e.g. `GET /notes`.
 */
function extractHeadingLabel(children: MdNode[]): string | undefined {
  for (const child of children) {
    if (
      child.type !== 'mdxTextExpression' &&
      child.type !== 'mdxFlowExpression'
    ) {
      continue
    }
    const source = typeof child.value === 'string' ? child.value : ''
    const label =
      readAnnotation(source, 'label') ?? readAnnotation(source, 'title')
    if (label) {
      const tag = readAnnotation(source, 'tag')
      return tag ? `${tag} ${label}` : label
    }
  }
  return undefined
}

/** Trims whitespace left dangling on edge text nodes after stripping annotations. */
function trimEdges(children: MdNode[]): MdNode[] {
  if (children.length === 0) return children
  const result = children.map(child => ({ ...child }))
  const first = result[0]
  if (first.type === 'text' && typeof first.value === 'string') {
    first.value = first.value.replace(/^\s+/, '')
  }
  const last = result[result.length - 1]
  if (last.type === 'text' && typeof last.value === 'string') {
    last.value = last.value.replace(/\s+$/, '')
  }
  return result.filter(child => !(child.type === 'text' && child.value === ''))
}

function getAttr(node: MdNode, name: string): string | boolean | undefined {
  const attr = node.attributes?.find(
    a => a.type === 'mdxJsxAttribute' && a.name === name
  )
  if (!attr) return undefined
  // Valueless attributes (e.g. `required`) parse with a null value → treat as true.
  if (attr.value == null) return true
  // Expression attributes (e.g. `level={3}`) → their source text.
  return typeof attr.value === 'string' ? attr.value : attr.value.value
}

function textOf(node: MdNode): string {
  if (typeof node.value === 'string') return node.value
  return (node.children ?? []).map(textOf).join('')
}

function heading(depth: number, text: string): MdNode {
  return { type: 'heading', depth, children: [{ type: 'text', value: text }] }
}

/** A tight bullet list of links, each optionally followed by `: description`. */
function linkList(
  items: Array<{ title: string; href: string; description?: string }>,
  resolveUrl: (url: string) => string | undefined
): MdNode {
  return {
    type: 'list',
    ordered: false,
    spread: false,
    children: items.map(item => ({
      type: 'listItem',
      spread: false,
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: resolveUrl(item.href),
              children: [{ type: 'text', value: item.title }]
            },
            ...(item.description
              ? [{ type: 'text', value: `: ${item.description}` }]
              : [])
          ]
        }
      ]
    }))
  }
}

function buildPropertyItem(
  node: MdNode,
  transformChildren: (nodes: MdNode[]) => MdNode[]
): MdNode {
  const name = getAttr(node, 'name')
  const type = getAttr(node, 'type')
  const required = getAttr(node, 'required') === true

  const meta = [
    typeof type === 'string' ? type : null,
    required ? 'required' : null
  ]
    .filter(Boolean)
    .join(', ')

  const heading: MdNode = {
    type: 'paragraph',
    children: [
      {
        type: 'strong',
        children: [{ type: 'text', value: String(name ?? '') }]
      },
      ...(meta ? [{ type: 'text', value: ` (${meta})` }] : [])
    ]
  }

  return {
    type: 'listItem',
    spread: false,
    children: [heading, ...transformChildren(node.children ?? [])]
  }
}

const LAYOUT_COMPONENTS = new Set(['Row', 'Col', 'CodeGroup', 'div', 'span'])

function makeTransformer(options: TransformOptions) {
  const resolveUrl = makeResolveUrl(options)

  function transformChildren(nodes: MdNode[]): MdNode[] {
    const out: MdNode[] = []
    for (const node of nodes) {
      const result = transformNode(node)
      if (result == null) continue
      if (Array.isArray(result)) out.push(...result)
      else out.push(result)
    }
    return out
  }

  function transformJsx(node: MdNode): MdNode | MdNode[] {
    const name = node.name ?? ''

    if (name === 'Note' || name === 'Warning') {
      const label: MdNode = {
        type: 'paragraph',
        children: [
          { type: 'strong', children: [{ type: 'text', value: `${name}:` }] }
        ]
      }
      return {
        type: 'blockquote',
        children: [label, ...transformChildren(node.children ?? [])]
      }
    }

    if (name === 'Properties') {
      const items = (node.children ?? [])
        .filter(child => child.name === 'Property')
        .map(child => buildPropertyItem(child, transformChildren))
      return { type: 'list', ordered: false, spread: false, children: items }
    }

    if (name === 'Property') {
      return buildPropertyItem(node, transformChildren)
    }

    if (name === 'kbd' || name === 'code') {
      return { type: 'inlineCode', value: textOf(node) }
    }

    if (name === 'em' || name === 'strong') {
      return {
        type: name === 'em' ? 'emphasis' : 'strong',
        children: transformChildren(node.children ?? [])
      }
    }

    if (name === 'a') {
      const href = getAttr(node, 'href')
      return {
        type: 'link',
        url: resolveUrl(typeof href === 'string' ? href : undefined),
        children: transformChildren(node.children ?? [])
      }
    }

    if (name === 'video') {
      const source = (node.children ?? []).find(
        child => child.name === 'source'
      )
      const src = getAttr(node, 'src') ?? (source && getAttr(source, 'src'))
      if (typeof src !== 'string') {
        throw new Error(`<video> without a src in ${options.pagePath}`)
      }
      return {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'Video: ' },
          {
            type: 'link',
            url: resolveUrl(src),
            children: [{ type: 'text', value: src }]
          }
        ]
      }
    }

    // MDX parses the content of `<pre>` as Markdown, so its paragraphs are
    // joined back into the literal text the page displays.
    if (name === 'pre') {
      return {
        type: 'code',
        lang: null,
        meta: null,
        value: (node.children ?? []).map(textOf).join('\n\n')
      }
    }

    if (name === 'Guides') {
      return [
        heading(2, 'Guides'),
        linkList(
          guides.map(g => ({
            title: g.name,
            href: g.href,
            description: g.description
          })),
          resolveUrl
        )
      ]
    }

    if (name === 'Resources') {
      return [
        heading(2, 'Resources'),
        linkList(
          resources.map(r => ({
            title: r.name,
            href: r.href,
            description: r.description
          })),
          resolveUrl
        )
      ]
    }

    if (name === 'ListNavigationSection') {
      const group = navigation.find(
        section => section.link === options.pagePath
      )
      return linkList(group?.links ?? [], resolveUrl)
    }

    // Decorative only.
    if (name === 'HeroPattern') return []

    // Layout-only components and elements: drop the tag, keep content.
    if (LAYOUT_COMPONENTS.has(name)) {
      return transformChildren(node.children ?? [])
    }

    throw new Error(
      `Unsupported MDX element <${name}> in ${options.pagePath}: teach src/lib/mdxToMarkdown.ts how to render it as Markdown`
    )
  }

  function transformNode(node: MdNode): MdNode | MdNode[] | null {
    switch (node.type) {
      // Imports/exports (incl. the `metadata`/`sections` exports) and `{…}` expressions.
      case 'mdxjsEsm':
      case 'mdxFlowExpression':
      case 'mdxTextExpression':
        return null
      case 'mdxJsxFlowElement':
      case 'mdxJsxTextElement':
        return transformJsx(node)
      case 'heading': {
        const label = extractHeadingLabel(node.children ?? [])
        let kids = trimEdges(transformChildren(node.children ?? []))
        if (label) {
          const signature: MdNode = { type: 'inlineCode', value: label }
          kids = kids.length
            ? [...kids, { type: 'text', value: ' ' }, signature]
            : [signature]
        }
        return { ...node, children: kids }
      }
      case 'code': {
        // `{{ title: '…' }}` annotations → the conventional `title="…"` meta.
        if (!node.meta?.startsWith('{{')) return node
        const title = readAnnotation(node.meta, 'title')
        return {
          ...node,
          meta: title ? `title=${JSON.stringify(title)}` : null
        }
      }
      case 'paragraph': {
        const kids = trimEdges(transformChildren(node.children ?? []))
        return kids.length === 0 ? null : { ...node, children: kids }
      }
      case 'link':
      case 'image':
      case 'definition':
        return {
          ...node,
          url: resolveUrl(node.url),
          ...(node.children
            ? { children: transformChildren(node.children) }
            : {})
        }
      default:
        if (node.children) {
          return { ...node, children: transformChildren(node.children) }
        }
        return node
    }
  }

  return function transform(tree: MdNode): MdNode {
    return { ...tree, children: transformChildren(tree.children ?? []) }
  }
}

export async function mdxToMarkdown(
  source: string,
  options: TransformOptions
): Promise<string> {
  // Parse MDX (mdx + gfm extensions), strip/unwrap to plain mdast, then
  // stringify without the mdx extension so no JSX is re-emitted.
  const tree = remark()
    .use(remarkMdx)
    .use(remarkGfm)
    .parse(source) as unknown as MdNode
  const cleaned = makeTransformer(options)(tree)

  const file = remark()
    .use(remarkGfm)
    .data('settings', { bullet: '-', rule: '-', listItemIndent: 'one' })
    .stringify(cleaned as never)

  return (
    String(file)
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  )
}

export interface MdxMetadata {
  title?: string
  description?: string
}

// estree nodes are loosely typed here too; only `export const metadata = {…}` matters.
interface EsNode {
  type: string
  [key: string]: any
}

/** Reads the string `title`/`description` of a page's `export const metadata`. */
export function mdxMetadata(source: string): MdxMetadata {
  const tree = remark().use(remarkMdx).parse(source) as unknown as MdNode
  const metadata: MdxMetadata = {}

  for (const node of tree.children ?? []) {
    if (node.type !== 'mdxjsEsm') continue
    const program = (node.data as { estree?: EsNode } | undefined)?.estree
    for (const statement of (program?.body ?? []) as EsNode[]) {
      const declarations: EsNode[] =
        statement.type === 'ExportNamedDeclaration'
          ? (statement.declaration?.declarations ?? [])
          : []
      const init = declarations.find(d => d.id?.name === 'metadata')?.init
      if (init?.type !== 'ObjectExpression') continue
      for (const property of init.properties as EsNode[]) {
        const key = property.key?.name ?? property.key?.value
        if (
          (key === 'title' || key === 'description') &&
          property.value?.type === 'Literal' &&
          typeof property.value.value === 'string'
        ) {
          metadata[key as keyof MdxMetadata] = property.value.value
        }
      }
    }
  }

  return metadata
}
