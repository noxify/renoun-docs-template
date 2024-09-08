import type { FileSystemSource, MDXContent } from "omnidoc/collections"
import { createCollection } from "omnidoc/collections"

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
    title: "Aria Docs",
    baseDirectory: "content/docs/aria-docs",
    basePath: "docs/aria-docs",
  },
)

export const OmnidocDocsCollection = createCollection<DocSchema>(
  "@content/docs/omnidoc-docs/**/*.{ts,tsx,mdx}",
  {
    title: "Omnidoc Docs",
    baseDirectory: "content/docs/omnidoc-docs",
    basePath: "docs/omnidoc-docs",
  },
)

export const collections = {
  "aria-docs": AriaDocsCollection,
  "omnidoc-docs": OmnidocDocsCollection,
}

export type AvailableCollections = keyof typeof collections
