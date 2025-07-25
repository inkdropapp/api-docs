'use client'

import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'
import { CloseButton } from '@headlessui/react'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <CloseButton
        as={Link}
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </CloseButton>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false
}) {
  return (
    <CloseButton
      as={Link}
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </CloseButton>
  )
}

function VisibleSectionHighlight({ group, pathname }) {
  let [sections, visibleSections] = useInitialValue(
    [useSectionStore(s => s.sections), useSectionStore(s => s.visibleSections)],
    useIsInsideMobileNavigation()
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      section => section.id === visibleSections[0]
    )
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex(link => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group, pathname }) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex(link => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-pink-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore(s => s.sections)],
    isInsideMobileNavigation
  )

  let isActiveGroup =
    group.links.findIndex(link => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map(link => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
              </NavLink>
              <AnimatePresence mode="popLayout" initial={false}>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 }
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.15 }
                    }}
                  >
                    {sections.map(section => (
                      <li key={section.id}>
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                        >
                          {section.title}
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
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
      { title: 'Data Store', href: '/modules/data-store' },
      { title: 'Environment', href: '/modules/environment' },
      { title: 'IPM Wrapper', href: '/modules/ipm-wrapper' },
      { title: 'Inkdrop Application', href: '/modules/inkdrop-application' },
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
      { title: 'Dialog', href: '/components/dialog' },
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
        title: 'Plugin Migration Guide from v3 to v4',
        href: '/appendix/plugin-migration-from-v3-to-v4'
      }
    ]
  }
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="https://docs.inkdrop.app/">
          User Manual
        </TopLevelNavItem>
        <TopLevelNavItem href="https://forum.inkdrop.app/">
          Forum
        </TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button
            href="https://my.inkdrop.app/"
            variant="filled"
            className="w-full"
          >
            Log in
          </Button>
        </li>
      </ul>
    </nav>
  )
}
