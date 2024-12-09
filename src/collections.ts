import type { FileSystemEntry } from "renoun/file-system"
import type { Headings, MDXContent } from "renoun/mdx"
import { Directory, EntryGroup, isDirectory, isFile } from "renoun/file-system"
import z from "zod"

export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  navTitle: z.string().optional(),
  entrypoint: z.string().optional(),
  alias: z.string().optional(),
})
export interface DocSchema {
  default: MDXContent
  frontmatter: z.infer<typeof frontmatterSchema>
  headings: Headings
}

export const allowedExtensions = ["mdx"]

const defaultFilter = (entry: FileSystemEntry) => {
  return isDirectory(entry) || isFile(entry, allowedExtensions)
}

export const AriaDocsCollection = new Directory<{ mdx: DocSchema }>({
  path: "./content/docs/aria-docs",
})
  .withFilter(defaultFilter)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  .withSchema("mdx", { frontmatter: frontmatterSchema.parse })
  .withBasePath("docs/aria-docs")
  .withModule((path) => import(`@content/docs/aria-docs/${path}`))

export const RenounDocsCollection = new Directory<{ mdx: DocSchema }>({
  path: "./content/docs/renoun-docs",
})
  .withFilter(defaultFilter)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  .withSchema("mdx", { frontmatter: frontmatterSchema.parse })

  .withBasePath("docs/renoun-docs")
  .withModule((path) => import(`@content/docs/renoun-docs/${path}`))

export const TestCollection = new Directory<{ mdx: DocSchema }>({
  path: "./content/docs/test-collection",
})
  .withFilter(defaultFilter)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  .withSchema("mdx", { frontmatter: frontmatterSchema.parse })

  .withBasePath("docs/test-collection")
  .withModule((path) => import(`@content/docs/test-collection/${path}`))

export const CollectionInfo = new EntryGroup({
  entries: [AriaDocsCollection, RenounDocsCollection, TestCollection],
})
