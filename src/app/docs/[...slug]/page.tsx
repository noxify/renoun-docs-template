import type { AvailableCollections } from "@/collections"
import { notFound } from "next/navigation"
import { collections } from "@/collections"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { TableOfContents } from "@/components/table-of-contents"
import { cn } from "@/lib/utils"

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
async function getSlugsFromCollection(collectionName: AvailableCollections) {
  const collection = collections[collectionName]
  const sources = await collection.getSources()

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

  for (const collection of Object.keys(collections)) {
    const collectionSlugs = await getSlugsFromCollection(
      collection as AvailableCollections,
    )
    slugs.push(...collectionSlugs)
  }

  return slugs
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const source = collections[params.slug[0] as AvailableCollections].getSource(
    removeFromArray(params.slug, [params.slug[0]]),
  )
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
            <article>
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

  const headings = await source.getNamedExport("headings").getValue()
  const Content = await source.getDefaultExport().getValue()

  return (
    <>
      <div className="gap-8 md:flex">
        <div>
          <article>
            <div
              className={cn(
                // default prose
                "prose dark:prose-invert",
                // remove backtick from inline code block
                "prose-code:before:hidden prose-code:after:hidden",
                // use full width
                "w-full max-w-[952px]",
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
        </div>
      </div>
    </>
  )
}
