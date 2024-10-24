import type { FileSystemSource } from "renoun/collections"
import type { MDXContent } from "renoun/mdx"
import { Collection, CompositeCollection } from "renoun/collections"

export interface DocSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
    tags?: string[]
    navTitle?: string
    entrypoint?: string
    alias?: string
  }
  headings: { text: string; id: string; depth: number }[]
}

export type DocsSource = FileSystemSource<DocSchema>

export const AriaDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "@content/docs/aria-docs/**/*.{tsx,mdx}",
    baseDirectory: "content",
  },
  (slug) => import(`../content/docs/aria-docs/${slug}.mdx`),
)

export const RenounDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "@content/docs/renoun-docs/**/*.{tsx,mdx}",
    baseDirectory: "content",
  },
  (slug) => import(`../content/docs/renoun-docs/${slug}.mdx`),
)

export const CollectionInfo = new CompositeCollection(
  AriaDocsCollection,
  RenounDocsCollection,
)
