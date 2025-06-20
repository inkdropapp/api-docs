# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Inkdrop API documentation website built with Next.js 14, providing comprehensive guides and API references for developers customizing the Inkdrop application.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start
```

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Content**: MDX (Markdown + JSX) for documentation pages
- **Styling**: Tailwind CSS with custom typography
- **Search**: FlexSearch for client-side fuzzy search
- **Syntax Highlighting**: Shiki
- **State Management**: Zustand
- **UI Components**: Headless UI, Framer Motion

### Directory Structure

- `/src/app/` - Documentation content organized by category:
  - `/guides/` - Tutorial-style documentation
  - `/data-access/` - Database API reference
  - `/modules/` - Core module documentation
  - `/states/` - State management docs
  - `/actions/` - Editor actions reference
  - `/components/` - UI component documentation
- `/src/components/` - React components for the site
- `/src/mdx/` - MDX processing plugins and search implementation
- `/public/images/` - Documentation images

### Search System

The search implementation (`/src/mdx/search.mjs`) automatically indexes all MDX content:

- Extracts headings and paragraphs from all documentation
- Uses FlexSearch for fuzzy searching
- Triggered by ⌘K / Ctrl+K
- Special handling for the commands page (indexes h3 headings)

## Working with Documentation

### Creating New Pages

1. Create an MDX file in the appropriate `/src/app/` subdirectory
2. Add metadata export:

```mdx
export const metadata = {
  title: 'Page Title',
  description: 'SEO description'

}
```

3. Add navigation entry in `/src/components/Navigation.jsx`

### MDX Page Structure

```mdx
export const metadata = {
  title: 'Title',
  description: 'Description'
}

# Page Title

Lead paragraph explaining the key concept.{{ className: 'lead' }}

## Section Title

Content...
```

### Custom MDX Components

- `<Row>` and `<Col>` - Two-column layouts for API docs
- `<Properties>` and `<Property>` - API property documentation
- `<CodeGroup>` - Multiple code examples with titles
- `<Note>` and `<Warning>` - Callout boxes

### Code Examples

````jsx
<Row>
  <Col>Explanation text...</Col>
  <Col sticky>```javascript // Code example ```</Col>
</Row>
````

### Images

Store in `/public/images/` and reference as:

```mdx
![Alt text](/images/filename.png)
```

## Key Implementation Details

### Navigation

Navigation structure is defined in `/src/components/Navigation.jsx`. Each section contains an array of pages with `title` and `href`.

### Search Index

The search index rebuilds automatically when MDX files change. The indexing logic is in `/src/mdx/search.mjs`.

### External Links

External links automatically:

- Open in new tabs
- Display an external link icon
- Are handled by the rehype plugin in `/src/mdx/rehype.mjs`

### Syntax Highlighting

Code blocks support language-specific highlighting via Shiki. Common languages: javascript, jsx, json, bash, css.

## Common Tasks

### Adding API Documentation

1. Create MDX file in appropriate category
2. Use two-column layout with `<Row>` and `<Col>`
3. Document properties with `<Properties>` component
4. Include practical code examples
5. Add to navigation in `/src/components/Navigation.jsx`

### Updating Existing Documentation

1. Edit the MDX file directly
2. Test locally with `npm run dev`
3. Verify search indexing works for new content
4. Check that all links and images work correctly

### Debugging Search Issues

- Search index is built from MDX content during build
- Check `/src/mdx/search.mjs` for indexing logic
- Verify content appears in search results after building

## Important Notes

- This is a documentation site without unit tests - focus on content accuracy
- The site uses static generation where possible for performance
- All documentation should follow the established MDX patterns for consistency
- Lead paragraphs (with `{{ className: 'lead' }}`) should summarize key concepts
- Keep code examples practical and directly runnable in Inkdrop

## Journaling workflow

You (the AI agent) have to report what you did in this project at each end of the task in my Inkdrop note.
Create one in the "Journal" notebook with the title "Log: Updating the Inkdrop API docs".
Update this note at each end of the task with the following format:

```
## Log: <task title>

- **Prompt**: <prompt you received>
- **Issue**: <issue description>

### What I did: <brief description of what you did>

...

### How I did it: <brief description of how you did it>

...

### What were challenging: <brief description of any challenges you faced>

...

### Future work (optional)

- <any future work or improvements you suggest>
```

- **IMPORTANT**: Do not forget to update the note at the end of each task!!!

