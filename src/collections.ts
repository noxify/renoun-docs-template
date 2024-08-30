import type { FileSystemSource, MDXContent } from "omnidoc/collections"
import { createCollection } from "omnidoc/collections"

export interface DocSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
    tags?: string[]
  }
}

export type DocsSource = FileSystemSource<DocSchema>

export const DocsCollection = createCollection<DocSchema>(
  "content/docs/**/*.{ts,tsx,mdx}",
  {
    title: "Docs",
    baseDirectory: "docs",
    basePath: "docs",
  },
)
