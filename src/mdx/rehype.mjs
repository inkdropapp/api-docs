import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as acorn from 'acorn'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import {
  createHighlighter,
  getTokenStyleObject,
  hastToHtml,
  stringifyTokenStyle
} from 'shiki'
import { visit } from 'unist-util-visit'

function rehypeParseCodeBlocks() {
  return tree => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      // Only fenced code blocks (`pre > code`) carry a language for rehypeShiki.
      // Inline code can sit directly inside a JSX element (e.g. a single-line
      // `<Note>…`code`…</Note>`), whose mdxJsxFlowElement node has no
      // `properties` — guard on the parent being a <pre> to avoid crashing.
      if (node.tagName === 'code' && parentNode?.tagName === 'pre') {
        parentNode.properties.language = node.properties.className
          ? node.properties?.className[0]?.replace(/^language-/, '')
          : 'txt'
      }
    })
  }
}

const SHIKI_THEME = 'solarized-dark'

let highlighterPromise

/**
 * Renders Shiki token lines as one `<span>` per line, without the `<pre>`
 * and `<code>` wrappers, since the `Code` component supplies its own.
 */
function tokenLinesToHtml(tokenLines) {
  let lineElements = tokenLines.map(tokens => ({
    type: 'element',
    tagName: 'span',
    properties: {},
    children: tokens.map(token => ({
      type: 'element',
      tagName: 'span',
      properties: { style: stringifyTokenStyle(getTokenStyleObject(token)) },
      children: [{ type: 'text', value: token.content }]
    }))
  }))

  return lineElements.map(lineElement => hastToHtml(lineElement)).join('\n')
}

function rehypeShiki() {
  return async tree => {
    highlighterPromise ??= createHighlighter({
      themes: [SHIKI_THEME],
      langs: []
    })
    let highlighter = await highlighterPromise

    let codeBlocks = []
    visit(tree, 'element', node => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        codeBlocks.push(node)
      }
    })

    let languages = new Set(
      codeBlocks.map(node => node.properties.language).filter(Boolean)
    )
    await highlighter.loadLanguage(...languages)

    for (let node of codeBlocks) {
      let textNode = node.children[0].children[0]

      node.properties.code = textNode.value

      if (node.properties.language) {
        let tokenLines = highlighter.codeToTokensBase(textNode.value, {
          lang: node.properties.language,
          theme: SHIKI_THEME
        })

        textNode.value = tokenLinesToHtml(tokenLines)
      }
    }
  }
}

function rehypeSlugify() {
  return tree => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', node => {
      if (
        (node.tagName === 'h2' || node.tagName === 'h3') &&
        !node.properties.id
      ) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return tree => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest'
          })
        }
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && child.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  [
    rehypeAddMDXExports,
    tree => ({
      sections: `[${getSections(tree).join()}]`
    })
  ]
]
