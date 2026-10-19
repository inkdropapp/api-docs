/** The `.md` address of a page, e.g. `/states/db.md`, or `/index.md` for the home page. */
export function markdownPath(pathname: string) {
  return pathname === '/' ? '/index.md' : `${pathname.replace(/\/+$/, '')}.md`
}
