import { type GridPattern } from '@/components/GridPattern'
import { DatabaseIcon } from '@/components/icons/DatabaseIcon'
import { ImageFileIcon } from '@/components/icons/FileIcon'
import { NotebookIcon } from '@/components/icons/NotebookIcon'
import { NoteIcon } from '@/components/icons/NoteIcon'
import { TagIcon } from '@/components/icons/TagIcon'
import { UtilsIcon } from '@/components/icons/UtilsIcon'

export interface Resource {
  href: string
  name: string
  description: string
  icon: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>
  pattern: Omit<
    React.ComponentPropsWithoutRef<typeof GridPattern>,
    'width' | 'height' | 'x'
  >
}

export const resources: Array<Resource> = [
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
