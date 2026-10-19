export interface NavGroup {
  title: string
  link?: string
  links: Array<{
    title: string
    href: string
  }>
}

export const navigation: Array<NavGroup> = [
  {
    title: 'Guides',
    links: [
      { title: 'Introduction', href: '/' },
      { title: 'The init file', href: '/guides/the-init-file' },
      { title: 'Style tweaks', href: '/guides/style-tweaks' },
      { title: 'Create a theme', href: '/guides/create-a-theme' },
      { title: 'Plugin: Word count', href: '/guides/plugin-word-count' },
      {
        title: 'Getting & modifying the app state',
        href: '/guides/flux-architecture'
      },
      {
        title: 'Access the local database',
        href: '/guides/access-the-local-database'
      },
      {
        title: 'Integrate with external programs',
        href: '/guides/integrate-with-external-programs'
      },
      { title: 'Customize the editor', href: '/guides/customize-the-editor' },
      { title: 'Extend the UI', href: '/guides/extend-the-ui' },
      {
        title: 'Create a note template',
        href: '/guides/create-a-note-template'
      },
      {
        title: 'Add styles for text annotations',
        href: '/guides/text-annotations'
      },
      {
        title: 'Create a blog using Astro',
        href: '/guides/create-a-blog-using-astro'
      },
      {
        title: 'Use ES modules in your plugin',
        href: '/guides/es-modules'
      },
      {
        title: 'List of commands',
        href: '/guides/list-of-commands'
      }
    ]
  },
  {
    title: 'Resources',
    links: [
      { title: 'Notes', href: '/data-access/notes' },
      { title: 'Notebooks', href: '/data-access/books' },
      { title: 'Tags', href: '/data-access/tags' },
      { title: 'Files', href: '/data-access/files' },
      { title: 'Utilities', href: '/data-access/utils' },
      { title: 'Events', href: '/data-access/events' },
      { title: 'Local HTTP Server', href: '/data-access/local-http-server' }
    ]
  },
  {
    title: 'Core Modules',
    links: [
      { title: 'Config', href: '/modules/config' },
      { title: 'Command Registry', href: '/modules/command-registry' },
      { title: 'Context Menu Manager', href: '/modules/context-menu-manager' },
      { title: 'Component Manager', href: '/modules/component-manager' },
      { title: 'Environment', href: '/modules/environment' },
      { title: 'Keymap Manager', href: '/modules/keymap-manager' },
      { title: 'Layout Manager', href: '/modules/layout-manager' },
      { title: 'Markdown Renderer', href: '/modules/markdown-renderer' },
      { title: 'Markdown Editor', href: '/modules/markdown-editor' },
      { title: 'Menu Manager', href: '/modules/menu-manager' },
      { title: 'Notification', href: '/modules/notification' },
      { title: 'Notification Manager', href: '/modules/notification-manager' },
      { title: 'Package', href: '/modules/package' },
      { title: 'Package Manager', href: '/modules/package-manager' },
      { title: 'Style Manager', href: '/modules/style-manager' },
      { title: 'Telescope Manager', href: '/modules/telescope-manager' },
      { title: 'Theme Manager', href: '/modules/theme-manager' }
    ]
  },
  {
    title: 'App States',
    link: '/states',
    links: [
      { title: 'Notebooks', href: '/states/books' },
      { title: 'Database', href: '/states/db' },
      { title: 'Editing note', href: '/states/editing-note' },
      { title: 'Editor', href: '/states/editor' },
      { title: 'Layouts', href: '/states/layouts' },
      { title: 'Local config', href: '/states/local-config' },
      { title: 'Main layout', href: '/states/main-layout' },
      { title: 'Note list bar', href: '/states/note-list-bar' },
      { title: 'Notes', href: '/states/notes' },
      { title: 'Preview', href: '/states/preview' },
      { title: 'Query context', href: '/states/query-context' },
      { title: 'Tags', href: '/states/tags' },
      { title: 'Stats', href: '/states/stats' }
    ]
  },
  {
    title: 'App Actions',
    link: '/actions',
    links: [
      { title: 'Editing note', href: '/actions/editing-note' },
      { title: 'Editor', href: '/actions/editor' }
    ]
  },
  {
    title: 'Components',
    links: [
      { title: 'Modal', href: '/components/modal' },
      { title: 'Dialog', href: '/components/dialog' },
      { title: 'Button', href: '/components/button' },
      { title: 'CommandButton', href: '/components/command-button' },
      { title: 'NotebookListBar', href: '/components/notebook-list-bar' },
      { title: 'MessageDialog', href: '/components/message-dialog' }
    ]
  },
  {
    title: 'Event Subscription (event-kit)',
    links: [
      { title: 'Disposable', href: '/event-subscription/disposable' },
      {
        title: 'Composite Disposable',
        href: '/event-subscription/composite-disposable'
      },
      { title: 'Emitter', href: '/event-subscription/emitter' }
    ]
  },
  {
    title: 'Appendix',
    links: [
      {
        title: 'Migration Guide from v5 to v6',
        href: '/appendix/plugin-migration-from-v5-to-v6'
      },
      {
        title: 'Migration Guide from v3 to v4',
        href: '/appendix/plugin-migration-from-v3-to-v4'
      }
    ]
  }
]
