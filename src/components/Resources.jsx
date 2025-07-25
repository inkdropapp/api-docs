'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import Link from 'next/link'

import { GridPattern } from '@/components/GridPattern'
import { Heading } from '@/components/Heading'
import { DatabaseIcon } from '@/components/icons/DatabaseIcon'
import { ImageFileIcon } from '@/components/icons/FileIcon'
import { NoteIcon } from '@/components/icons/NoteIcon'
import { NotebookIcon } from '@/components/icons/NotebookIcon'
import { TagIcon } from '@/components/icons/TagIcon'
import { UtilsIcon } from '@/components/icons/UtilsIcon'

const resources = [
  {
    href: '/data-access/notes',
    name: 'Notes',
    description:
      'Learn about the note model and how to create, retrieve, update, delete, and list notes.',
    icon: NoteIcon,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3]
      ]
    }
  },
  {
    href: '/data-access/books',
    name: 'Notebooks',
    description:
      'Learn about the notebook model and how to organize your notes with notebooks.',
    icon: NotebookIcon,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3]
      ]
    }
  },
  {
    href: '/data-access/tags',
    name: 'Tags',
    description:
      'Learn about the tag model and how to categorize your notes with tags.',
    icon: TagIcon,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4]
      ]
    }
  },
  {
    href: '/data-access/files',
    name: 'Files',
    description:
      'Files in Inkdrop are primarily used as image attachments that can be inserted into notes.',
    icon: ImageFileIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]]
    }
  },
  {
    href: '/data-access/utils',
    name: 'Utilities',
    description:
      'Provides convenient methods for managing documents in the local database.',
    icon: UtilsIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]]
    }
  },
  {
    href: '/data-access/local-http-server',
    name: 'Local HTTP server',
    description:
      'The Inkdrop client app can open a simple HTTP server so that you can access the data from an external program easily.',
    icon: DatabaseIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]]
    }
  }
]

function ResourceIcon({ icon: Icon }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/5 ring-1 ring-zinc-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-zinc-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-emerald-300/10 dark:group-hover:ring-emerald-400">
      <Icon className="h-5 w-5 fill-zinc-700/10 stroke-zinc-700 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400" />
    </div>
  )
}

function ResourcePattern({ mouseX, mouseY, ...gridProps }) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl mask-[linear-gradient(white,transparent)] transition duration-300 group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#D7EDEA] to-[#F4FBDF] opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  )
}

function Resource({ resource }) {
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      key={resource.href}
      onMouseMove={onMouseMove}
      className="group relative flex rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <ResourcePattern {...resource.pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-zinc-900/7.5 ring-inset group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative rounded-2xl px-4 pt-16 pb-4">
        <ResourceIcon icon={resource.icon} />
        <h3 className="mt-4 text-sm/7 font-semibold text-zinc-900 dark:text-white">
          <Link href={resource.href}>
            <span className="absolute inset-0 rounded-2xl" />
            {resource.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {resource.description}
        </p>
      </div>
    </div>
  )
}

export function Resources() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="resources">
        Resources
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {resources.map(resource => (
          <Resource key={resource.href} resource={resource} />
        ))}
      </div>
    </div>
  )
}
