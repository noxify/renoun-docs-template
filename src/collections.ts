import type { FileSystemSource } from "renoun/collections"
import type { MDXContent } from "renoun/mdx"
import { Collection, CompositeCollection } from "renoun/collections"
import { Directory } from "renoun/file-system"

export interface DocSchema {
  default: MDXContent
  frontmatter?: {
    title: string
    description: string
    tags?: string[]
    navTitle?: string
    entrypoint?: string
    alias?: string
    openapi?: boolean
  }
  headings: { text: string; id: string; depth: number }[]
}

export type DocsSource = FileSystemSource<DocSchema>

export const allowedExtensions = ["mdx"]

export const AriaDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "docs/aria-docs/**/*.{tsx,mdx}",
    baseDirectory: "content",
  },
  (slug) => import(`../content/docs/aria-docs/${slug}.mdx`),
)

export const RenounDocsCollection = new Collection<DocSchema>(
  {
    filePattern: "docs/renoun-docs/**/*.{tsx,mdx}",
    baseDirectory: "content",
  },
  (slug) => import(`../content/docs/renoun-docs/${slug}.mdx`),
)

export const TestCollection = new Collection<DocSchema>(
  {
    filePattern: "docs/test-collection/**/*.{tsx,mdx}",
    baseDirectory: "content",
  },
  (slug) => import(`../content/docs/test-collection/${slug}.mdx`),
)

export const TestDirectory = new Directory<{ mdx: DocSchema }>({
  path: "./content/docs/test-collection",
  //getModule: (path) => import(`../content/docs/renoun-docs/${path}`),
})

export const CollectionInfo = new CompositeCollection(
  AriaDocsCollection,
  RenounDocsCollection,
  TestCollection,
)
