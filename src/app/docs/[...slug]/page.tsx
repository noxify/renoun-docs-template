import type { DocSchema } from "@/collections"
import type { FileSystemSource } from "renoun/collections"
import { notFound } from "next/navigation"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { TableOfContents } from "@/components/table-of-contents"
import { getCollectionInfo } from "@/lib/collections"
import { cn } from "@/lib/utils"
import { ExternalLinkIcon } from "lucide-react"

function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
  return array.filter((value) => !valueToRemove.includes(value))
}

/**
 * This seems to be a bit hacky - maybe it is,
 * but without manipulation the response from `getPathSegments()`
 * we can't use the `basePath` configuration inside the `collections.ts`.
 *
 * If we comment the `basePath`, then the slug is generated correctly
 * but the links for the sidebar navigation are broken.
 *
 * If we set the `basePath` then the sidebar links are working,
 * but nextjs can't find the page.
 *
 * So, this is the "best of both worlds" :D
 * If you know a better solution please feel free to create a PR <3
 */
async function getSlugsFromCollection(collectionName: string) {
  const collection = (await getCollectionInfo()).find(
    (collection) => collection.alias === collectionName,
  )

  if (!collection) {
    return []
  }

  const sources = await collection.collection.getSources()

  const deleteItems = ["docs"]

  return (
    sources
      // if you don't want to generate dummy pages for directories,
      // you have to activate the filter
      //.filter((source) => source.isFile())
      .map((source) => ({
        slug: [...removeFromArray(source.getPathSegments(), deleteItems)],
      }))
  )
}

export async function generateStaticParams() {
  const slugs = []

  const collections = await getCollectionInfo()

  for (const collection of collections) {
    // force add the root page to the available pages
    // otherwise you can't call `/docs/<product>` directly
    slugs.push({ slug: [collection.alias] })
    const collectionSlugs = await getSlugsFromCollection(collection.alias)
    slugs.push(...collectionSlugs)
  }

  return slugs
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  let source: FileSystemSource<DocSchema> | undefined
  const collections = await getCollectionInfo()

  const collection = collections.find(
    (collection) => collection.alias === params.slug[0],
  )?.collection

  if (!collection) {
    return notFound()
  }

  // to support something like `/docs/<product>/`
  // we have to check the slug length - In our case we know that the first element in the slug array
  // is always the collection name - so we can use this to load the `index.mdx` if there is any
  // if there are two or more elements, we just load the requested page content
  if (params.slug.length > 1) {
    source = collection.getSource(
      removeFromArray(params.slug, [params.slug[0]]),
    )
  } else {
    source = collection.getSource([
      ...removeFromArray(params.slug, [params.slug[0]]),
      "index",
    ])
  }

  // if we can't find the source then return a 404
  if (!source) {
    return notFound()
  }

  const sections = await source.getSources({ depth: 1 })

  // fallback rendering if the user browses to page page
  // which is a directory e.g. calling /docs/<product>/getting-started instead of /docs/<product>/getting-started/installation
  // this is only the case if you do not have a `index.mdx` in the `getting-started` directory
  if (source.isDirectory()) {
    return (
      <>
        <div className="flex flex-col gap-y-8">
          <div>
            <article data-pagefind-body>
              <div
                className={cn(
                  // default prose
                  "prose dark:prose-invert",
                  // remove backtick from inline code block
                  "prose-code:before:hidden prose-code:after:hidden",
                  // use full width
                  "w-full max-w-full",
                )}
              >
                <h1>{source.getTitle()}</h1>
              </div>

              <SectionGrid sections={sections} />

              <Siblings source={source} />
            </article>
            <div>
              <Comments />
            </div>
          </div>
        </div>
      </>
    )
  }

  const headings = await source.getExport("headings").getValue()
  const Content = await source.getExport("default").getValue()

  return (
    <>
      <div className="gap-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div>
          <article data-pagefind-body>
            <div
              className={cn(
                // default prose
                "prose dark:prose-invert",
                // remove backtick from inline code block
                "prose-code:before:hidden prose-code:after:hidden",
                // use full width
                "max-w-auto w-full min-w-full",
                "grow",
                "prose-headings:scroll-mt-20",
              )}
            >
              <h1>{source.getTitle()}</h1>
              <Content />
            </div>

            <SectionGrid sections={sections} />

            <Siblings source={source} />
          </article>
          <div>
            <Comments />
          </div>
        </div>
        <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
          <TableOfContents toc={headings} />

          <div className="mt-6 border-t pt-6">
            <a
              href={source.getEditPath()}
              target="_blank"
              className="flex items-center text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              Edit this page <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
