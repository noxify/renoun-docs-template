import type { CollectionSource, FileSystemSource } from "renoun/collections"
import type { MDXContent } from "renoun/mdx"
import { Collection } from "renoun/collections"

export interface DocSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
    tags?: string[]
    navTitle?: string
  }
  headings: { text: string; id: string; depth: number }[]
}

export type DocsSource = FileSystemSource<DocSchema>

export interface CollectionSchema {
  metadata: {
    title: string
    entrypoint: string
    alias: string
    collection: CollectionSource<DocSchema>
  }
}

export const AriaDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "@content/docs/aria-docs/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/aria-docs",
    basePath: "docs/aria-docs",
  },
  (slug) => import(`../content/docs/aria-docs/${slug}.mdx`),
)

export const RenounDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "@content/docs/renoun-docs/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/renoun-docs",
    basePath: "docs/renoun-docs",
  },
  (slug) => import(`../content/docs/renoun-docs/${slug}.mdx`),
)

export const CollectionInfo = new Collection<CollectionSchema>(
  {
    filePattern: "@content/docs/**/metadata.ts",
    baseDirectory: "content/docs",
    basePath: "docs",
  },
  (slug) => import(`../content/docs/${slug}.ts`),
)
