import { Directory, EntryGroup, withSchema } from "renoun/file-system"
import z from "zod"

export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  navTitle: z.string().optional(),
  entrypoint: z.string().optional(),
  alias: z.string().optional(),
})

export const AriaDocsCollection = new Directory({
  path: "content/docs/aria-docs",
  loaders: {
    mdx: withSchema<{ frontmatter: z.infer<typeof frontmatterSchema> }>(
      // {frontmatter: frontmatterSchema},
      (path) => import(`@content/docs/aria-docs/${path}.mdx`),
    ),
  },
})

export const RenounDocsCollection = new Directory({
  path: "content/docs/renoun-docs",
  include: "*.mdx",
  loaders: {
    mdx: withSchema<{ frontmatter: z.infer<typeof frontmatterSchema> }>(
      (path) => import(`@content/docs/renoun-docs/${path}.mdx`),
    ),
  },
})

export const TestCollection = new Directory({
  path: "content/docs/test-collection",
  include: "*.mdx",
  loaders: {
    mdx: withSchema<{ frontmatter: z.infer<typeof frontmatterSchema> }>(
      (path) => import(`@content/docs/test-collection/${path}.mdx`),
    ),
  },
})

export const CollectionInfo = new EntryGroup({
  entries: [AriaDocsCollection, RenounDocsCollection, TestCollection],
})
