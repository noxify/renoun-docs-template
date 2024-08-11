import type { FileSystemSource, MDXContent } from "mdxts/collections"
import { createCollection } from "mdxts/collections"

export interface PostSchema {
  default: MDXContent
  frontmatter?: {
    title: string
    description: string
  }
}

export interface DocsSchema {
  default: MDXContent
  frontmatter?: {
    title: string
    description: string
  }
}

export type PostSource = FileSystemSource<
  { default: PostSchema["default"] } & {
    frontmatter?: PostSchema["frontmatter"]
  }
>

export type DocsSource = FileSystemSource<{
  default: DocsSchema["default"]
  frontmatter?: DocsSchema["frontmatter"]
}>

export const PostsCollection = createCollection<{
  default: PostSchema["default"]
  frontmatter?: PostSchema["frontmatter"]
}>("@/content/posts/**/*.{ts,mdx}", {
  title: "Posts",
  baseDirectory: "posts",
  basePath: "posts",
})

export const DocsCollection = createCollection<{
  default: DocsSchema["default"]
  frontmatter?: DocsSchema["frontmatter"]
}>("@/content/docs/**/*.{ts,mdx}", {
  title: "Docs",
  baseDirectory: "docs",
  basePath: "docs",
})
