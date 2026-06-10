import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkMdx from 'remark-mdx'

/**
 * Converts an MDX source string into clean GitHub-Flavored Markdown:
 * strips imports/exports and `{{ … }}` annotations, unwraps the custom JSX
 * components used throughout the docs, and rewrites relative links/images to
 * absolute URLs so the result is self-contained when pasted elsewhere.
 */

// mdast/mdxast nodes are loosely typed here; we only touch a handful of fields.
interface MdNode {
  type: string
  children?: MdNode[]
  value?: string
  url?: string
  name?: string | null
  attributes?: MdxAttribute[]
  [key: string]: unknown
}

interface MdxAttribute {
  type: string
  name?: string
  value?: string | null
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

/** Pulls a `label`/`title` string out of a `{{ label: '…' }}` annotation expression. */
function extractHeadingLabel(children: MdNode[]): string | undefined {
  for (const child of children) {
    if (child.type !== 'mdxTextExpression' && child.type !== 'mdxFlowExpression') {
      continue
    }
    const match = /\b(?:label|title)\s*:\s*(['"])(.*?)\1/.exec(
      typeof child.value === 'string' ? child.value : ''
    )
    if (match) return match[2]
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
  return attr.value == null ? true : attr.value
}

function buildPropertyItem(
  node: MdNode,
  transformChildren: (nodes: MdNode[]) => MdNode[]
): MdNode {
  const name = getAttr(node, 'name')
  const type = getAttr(node, 'type')
  const required = getAttr(node, 'required') === true

  const meta = [typeof type === 'string' ? type : null, required ? 'required' : null]
    .filter(Boolean)
    .join(', ')

  const heading: MdNode = {
    type: 'paragraph',
    children: [
      { type: 'strong', children: [{ type: 'text', value: String(name ?? '') }] },
      ...(meta ? [{ type: 'text', value: ` (${meta})` }] : [])
    ]
  }

  return {
    type: 'listItem',
    spread: false,
    children: [heading, ...transformChildren(node.children ?? [])]
  }
}

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
        children: [{ type: 'strong', children: [{ type: 'text', value: `${name}:` }] }]
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

    // Layout-only components (Row, Col, CodeGroup, …): drop the tag, keep content.
    return transformChildren(node.children ?? [])
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
          ...(node.children ? { children: transformChildren(node.children) } : {})
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
  const tree = remark().use(remarkMdx).use(remarkGfm).parse(source) as unknown as MdNode
  const cleaned = makeTransformer(options)(tree)

  const file = remark()
    .use(remarkGfm)
    .data('settings', { bullet: '-', rule: '-', listItemIndent: 'one' })
    .stringify(cleaned as never)

  return String(file).replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
