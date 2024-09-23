import type { FileSystemSource, MDXContent } from "renoun/collections"
import { createCollection } from "renoun/collections"

export interface DocSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
    tags?: string[]
  }
  headings: { text: string; id: string; depth: number }[]
}

export type DocsSource = FileSystemSource<DocSchema>

export const AriaDocsCollection = createCollection<DocSchema>(
  "@content/docs/aria-docs/**/*.{ts,tsx,mdx}",
  {
    baseDirectory: "content/docs/aria-docs",
    basePath: "docs/aria-docs",
  },
)

export const RenounDocsCollection = createCollection<DocSchema>(
  "@content/docs/renoun-docs/**/*.{ts,tsx,mdx}",
  {
    baseDirectory: "content/docs/renoun-docs",
    basePath: "docs/renoun-docs",
  },
)

export const PlaywrightCollection = createCollection<DocSchema>(
  "@content/docs/playwright/**/*.{ts,tsx,mdx}",
  {
    baseDirectory: "content/docs/playwright",
    basePath: "docs/playwright",
  },
)

export const collections = {
  "aria-docs": AriaDocsCollection,
  "renoun-docs": RenounDocsCollection,
  playwright: PlaywrightCollection,
}

export type AvailableCollections = keyof typeof collections
