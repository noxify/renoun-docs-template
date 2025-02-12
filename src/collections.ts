import {
  Directory,
  EntryGroup,
  isDirectory,
  isFile,
  withSchema,
} from "renoun/file-system"
import z from "zod"

export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  navTitle: z.string().optional(),
  entrypoint: z.string().optional(),
  alias: z.string().optional(),
  showToc: z.boolean().optional().default(true),
})

export const headingSchema = z.array(
  z.object({
    depth: z.number(),
    text: z.string(),
    id: z.string(),
  }),
)

export const docSchema = {
  frontmatter: frontmatterSchema,
  headings: headingSchema,
}

export const allowedExtensions = ["mdx", "tsx", "ts"]

export const AriaDocsCollection = new Directory({
  path: "content/docs/aria-docs",
  // base path is required, otherwise we can't build the correct slugs in the `generateStaticParams`
  basePath: "aria-docs",
  loaders: {
    mdx: withSchema(
      docSchema,
      (path) => import(`@content/docs/aria-docs/${path}.mdx`),
    ),
    tsx: withSchema((path) => import(`@content/docs/aria-docs/${path}.tsx`)),
    ts: withSchema((path) => import(`@content/docs/aria-docs/${path}.ts`)),
  },
})

export const RenounDocsCollection = new Directory({
  path: "content/docs/renoun-docs",
  // base path is required, otherwise we can't build the correct slugs in the `generateStaticParams`
  basePath: "renoun-docs",
  loaders: {
    mdx: withSchema(
      docSchema,
      (path) => import(`@content/docs/renoun-docs/${path}.mdx`),
    ),
    tsx: withSchema((path) => import(`@content/docs/renoun-docs/${path}.tsx`)),
    ts: withSchema((path) => import(`@content/docs/renoun-docs/${path}.ts`)),
  },
})

export const TestCollection = new Directory({
  path: "content/docs/test-collection",
  // base path is required, otherwise we can't build the correct slugs in the `generateStaticParams`
  basePath: "test-collection",
  loaders: {
    mdx: withSchema(
      docSchema,
      (path) => import(`@content/docs/test-collection/${path}.mdx`),
    ),
    tsx: withSchema(
      (path) => import(`@content/docs/test-collection/${path}.tsx`),
    ),
    ts: withSchema(
      (path) => import(`@content/docs/test-collection/${path}.ts`),
    ),
  },
})

export const CollectionInfo = new EntryGroup({
  entries: [AriaDocsCollection, RenounDocsCollection, TestCollection],
})

export type EntryType = Awaited<ReturnType<typeof CollectionInfo.getEntry>>
export type DirectoryType = Awaited<
  ReturnType<typeof CollectionInfo.getDirectory>
>

export function getTitle(
  collection: EntryType,
  frontmatter: z.infer<typeof frontmatterSchema>,
  includeTitle = false,
) {
  return includeTitle
    ? (frontmatter.navTitle ?? frontmatter.title ?? collection.getTitle())
    : (frontmatter.navTitle ?? collection.getTitle())
}

export async function getDirectoryContent(source: EntryType) {
  // first, try to get the file based on the given path

  return await CollectionInfo.getDirectory(source.getPathSegments()).catch(
    () => null,
  )
}

/**
 * Helper function to get the file content for a given source entry
 * This function will try to get the file based on the given path and the "mdx" extension
 * If the file is not found, it will try to get the index file based on the given path and the "mdx" extension
 * If there is also no index file, it will return null
 *
 * @param source {EntryType} the source entry to get the file content for
 */
export async function getFileContent(source: EntryType) {
  // first, try to get the file based on the given path

  return await CollectionInfo.getFile(source.getPathSegments(), "mdx").catch(
    async () => {
      return await CollectionInfo.getFile(
        [...source.getPathSegments(), "index"],
        "mdx",
      ).catch(() => null)
    },
  )
}

/**
 * Helper function to get the sections for a given source entry
 * This function will try to get the sections based on the given path
 *
 * If there there are no entries/children for the current path, it will return an empty array
 *
 * @param source {EntryType} the source entry to get the sections for
 * @returns
 */
export async function getSections(source: EntryType) {
  if (source.getDepth() > -1) {
    if (isDirectory(source)) {
      return (
        await (
          await CollectionInfo.getDirectory(source.getPathSegments())
        ).getEntries()
      ).filter((ele) => ele.getPath() !== source.getPath())
    }

    if (isFile(source) && source.getBaseName() === "index") {
      return await source.getParent().getEntries()
    }
    return []
  } else {
    return (
      await (
        await CollectionInfo.getDirectory(source.getPathSegments())
      ).getEntries()
    ).filter((ele) => ele.getPath() !== source.getPath())
  }
}
