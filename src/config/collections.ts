import type { FileSystemSource, MDXContent } from "mdxts/collections"
import { createSource, mergeSources } from "mdxts"
import { createCollection } from "mdxts/collections"

export interface PostSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
  }
}

export interface DocSchema {
  default: MDXContent
  frontmatter: {
    title: string
    summary: string
  }
}

interface FrontMatter {
  title: string
  date: Date
  summary?: string
  tags?: string[]
}

export type PostSource = FileSystemSource<PostSchema>

export type DocsSource = FileSystemSource<{
  default: DocSchema["default"]
  frontmatter?: DocSchema["frontmatter"]
}>

// export const PostsCollection = createCollection<PostSchema>(
//   "@/content/posts/**/*.{ts,mdx}",
//   {
//     title: "Posts",
//     baseDirectory: "posts",
//     basePath: "posts",
//   },
// )

// export const DocsCollection = createCollection<DocsSchema>(
//   "@/content/docs/**/*.{ts,mdx}",
//   {
//     title: "Docs",
//     baseDirectory: "docs",
//     basePath: "docs",
//   },
// )

export const PostsSource = createSource("../content/posts/**/*.mdx", {
  baseDirectory: "posts",
  basePathname: "posts",
})

export const DocsSource = createSource("../content/docs/**/*.mdx", {
  baseDirectory: "docs",
  basePathname: "docs",
})

export const allContent = mergeSources(PostsSource, DocsSource)
