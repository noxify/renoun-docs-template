import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionInfo } from "@/collections"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import {
  MobileTableOfContents,
  TableOfContents,
} from "@/components/table-of-contents"
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

interface PageProps {
  params: Promise<{ slug: string[] }>
}

async function getParentTitle(slug: string[]) {
  const combinations = slug.reduce(
    (acc: string[][], curr) => acc.concat(acc.map((sub) => [...sub, curr])),
    [[]],
  )

  const titles = []

  for (const currentPageSegement of combinations) {
    const collection = CollectionInfo.getSource(
      ["docs", ...currentPageSegement].join("/"),
    )

    if (!collection) {
      continue
    }

    if (collection.isDirectory()) {
      titles.push(collection.getTitle())
    } else {
      const frontmatter = await collection.getExport("frontmatter").getValue()
      titles.push(frontmatter.navTitle ?? collection.getTitle())
    }
  }

  return titles
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const titles = await getParentTitle(params.slug)

  return {
    title: titles.join(" - "),
  }
}

export default async function DocsPage(props: PageProps) {
  const params = await props.params
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
        <div className="container py-6">
          <div className={cn("flex flex-col gap-y-8")}>
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
              </article>

              <Siblings source={collection} collectionName={params.slug[0]} />

              <div>
                <Comments />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const frontmatter = await collection.getExport("frontmatter").getValue()
  const Content = await collection.getExport("default").getValue()

  if (frontmatter.openapi) {
    return (
      <div className={cn("gap-8 xl:grid xl:grid-cols-1")}>
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
                "xl:prose-headings:scroll-mt-20",
                "prose-headings:scroll-mt-28",
                "prose-table:my-0",
                "prose-th:pb-0",
              )}
            >
              <Content />
            </div>
          </article>
          <div className="container py-6">
            <Siblings source={collection} collectionName={params.slug[0]} />
          </div>
        </div>
      </div>
    )
  }

  const headings = await collection.getExport("headings").getValue()

  return (
    <>
      <div className="container py-6">
        {headings.length > 0 && <MobileTableOfContents toc={headings} />}

        <div
          className={cn("gap-8 xl:grid xl:grid-cols-[1fr_300px]", {
            "mt-12 xl:mt-0": headings.length > 0,
          })}
        >
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
                  "xl:prose-headings:scroll-mt-20",
                  "prose-headings:scroll-mt-28",
                  "prose-table:my-0",
                  "prose-th:pb-0",
                )}
              >
                <h1>{collection.getTitle()}</h1>
                <Content />
              </div>

              <SectionGrid sections={sections} />
            </article>

            <Siblings source={collection} collectionName={params.slug[0]} />

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
      </div>
    </>
  )
}
