import { notFound } from "next/navigation"
import { CollectionInfo } from "@/collections"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { TableOfContents } from "@/components/table-of-contents"
import { cn } from "@/lib/utils"
import { ExternalLinkIcon } from "lucide-react"

function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
  return array.filter((value) => !valueToRemove.includes(value))
}

export async function generateStaticParams() {
  const slugs = []

  const collections = await CollectionInfo.getSources()

  for (const collection of collections) {
    slugs.push({
      slug: removeFromArray(collection.getPathSegments(), ["docs"]),
    })
  }

  return slugs
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const collection = CollectionInfo.getSource(
    ["/docs", ...params.slug].join("/"),
  )

  if (!collection) {
    return notFound()
  }

  const sections = await collection.getSources({ depth: 1 })

  // fallback rendering if the user browses to page page
  // which is a directory e.g. calling /docs/<product>/getting-started instead of /docs/<product>/getting-started/installation
  // this is only the case if you do not have a `index.mdx` in the `getting-started` directory
  if (collection.isDirectory()) {
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
                <h1>{collection.getTitle()}</h1>
              </div>

              <SectionGrid sections={sections} />

              <Siblings source={collection} />
            </article>
            <div>
              <Comments />
            </div>
          </div>
        </div>
      </>
    )
  }

  const headings = await collection.getExport("headings").getValue()
  const Content = await collection.getExport("default").getValue()

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
              <h1>{collection.getTitle()}</h1>
              <Content />
            </div>

            <SectionGrid sections={sections} />

            <Siblings source={collection} />
          </article>
          <div>
            <Comments />
          </div>
        </div>
        <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
          <TableOfContents toc={headings} />

          <div className="mt-6 border-t pt-6">
            <a
              href={collection.getEditPath()}
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
