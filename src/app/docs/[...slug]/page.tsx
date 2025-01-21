// import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionInfo } from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import {
  MobileTableOfContents,
  TableOfContents,
} from "@/components/table-of-contents"
import { cn } from "@/lib/utils"
import { format } from "date-fns/format"
import { ExternalLinkIcon } from "lucide-react"
import { isDirectory, isFile } from "renoun/file-system"

function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
  return array.filter((value) => !valueToRemove.includes(value))
}

export async function generateStaticParams() {
  const slugs = []

  const collections = await CollectionInfo.getEntries({
    recursive: true,
    includeIndexAndReadme: false,
  })

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

// async function getParentTitle(slug: string[]) {
//   const combinations = slug.reduce(
//     (acc: string[][], curr) => acc.concat(acc.map((sub) => [...sub, curr])),
//     [[]],
//   )

//   const titles = []

//   for (const currentPageSegement of combinations) {
//     const collection = await CollectionInfo.getEntry(
//       ["docs", ...currentPageSegement].join("/"),
//     )

//     if (!collection) {
//       continue
//     }

//     if (isDirectory(collection)) {
//       titles.push(collection.getTitle())
//     } else {
//       const frontmatter = await collection.getExport("frontmatter").getValue()
//       titles.push(frontmatter?.navTitle ?? collection.getTitle())
//     }
//   }

//   return titles
// }

async function getBreadcrumbItems(slug: string[]) {
  const combinations = slug.reduce(
    (acc: string[][], curr) => acc.concat(acc.map((sub) => [...sub, curr])),
    [[]],
  )

  const titles = []

  for (const currentPageSegement of combinations) {
    let collection
    try {
      collection = await CollectionInfo.getEntry(currentPageSegement)
    } catch (e: unknown) {
      continue
    }

    if (isDirectory(collection)) {
      titles.push({
        title: collection.getTitle(),
        path: collection.getPathSegments().join("/"),
      })
    } else {
      const file = await CollectionInfo.getFile(currentPageSegement, "mdx")
      const frontmatter = await file.getExportValue("frontmatter")
      titles.push({
        title: frontmatter.navTitle ?? collection.getTitle(),
        path: collection.getPath(),
      })
    }
  }

  return titles
}

// export async function generateMetadata(props: PageProps): Promise<Metadata> {
//   const params = await props.params
//   const titles = await getParentTitle(params.slug)

//   return {
//     title: titles.join(" - "),
//   }
// }

export default async function DocsPage(props: PageProps) {
  const params = await props.params

  let collection

  try {
    collection = await CollectionInfo.getEntry(params.slug)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    console.warn("Unable to get entry for path:", params.slug)
    return notFound()
  }
  console.log({
    collection,
    isDirectory: isDirectory(collection),
    isFile: isFile(collection),
  })

  // const breadcrumbItems = await getBreadcrumbItems(params.slug)

  // const sections = await collection.getSources({ depth: 1 })

  // // fallback rendering if the user browses to page page
  // // which is a directory e.g. calling /docs/<product>/getting-started instead of /docs/<product>/getting-started/installation
  // // this is only the case if you do not have a `index.mdx` in the `getting-started` directory
  if (isDirectory(collection)) {
    return <DirectoryContent path={params.slug} />
    return (
      <>
        <div className="container py-6">
          <div className={cn("flex flex-col gap-y-8")}>
            <div>
              {/* <SiteBreadcrumb items={breadcrumbItems} /> */}

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

                {/* <SectionGrid sections={sections} /> */}
              </article>

              {/* <Siblings source={collection} collectionName={params.slug[0]} /> */}

              <div>{/* <Comments /> */}</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <FileContent path={params.slug} />

  const frontmatter = await collection
  // const Content = await collection.getExport("default").getValue()

  // const headings = await collection.getExport("headings").getValue()

  // const lastUpdate = await collection.getUpdatedAt()

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
            <SiteBreadcrumb items={breadcrumbItems} />

            <div data-pagefind-body>
              <h1
                className="no-prose mb-2 scroll-m-20 text-4xl font-light tracking-tight lg:text-5xl"
                data-pagefind-meta="title"
              >
                {frontmatter.title ?? collection.getTitle()}
              </h1>
              <p className="mb-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                {frontmatter.description ?? ""}
              </p>
              <article>
                <div
                  className={cn(
                    // default prose
                    "prose dark:prose-invert",
                    // remove backtick from inline code block
                    "prose-code:before:hidden prose-code:after:hidden",
                    // use full width
                    "max-w-auto w-full min-w-full",
                    "grow",

                    "prose-table:my-0",
                    "prose-th:pb-0",

                    "xl:prose-headings:scroll-mt-20",
                    "prose-headings:scroll-mt-28",

                    "prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight",
                    "prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight",
                    "prose-h4:text-xl prose-h4:font-semibold prose-h4:tracking-tight",

                    "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
                    "prose-p:leading-7 prose-p:[&:not(:first-child)]:mt-6",

                    "prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-ul:[&>ul]:my-2 prose-ul:[&>ul]:ml-0",
                  )}
                >
                  <Content />
                </div>

                <SectionGrid sections={sections} />
              </article>
            </div>
            <Siblings source={collection} collectionName={params.slug[0]} />

            <div>
              <Comments />
            </div>
          </div>
          <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
            <TableOfContents toc={headings} />

            <div className="my-6 grid gap-y-4 border-t pt-6">
              <div>
                <a
                  href={collection.getEditPath()}
                  target="_blank"
                  className="flex items-center text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  Edit this page <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </a>
              </div>

              {lastUpdate && (
                <div className="text-sm text-muted-foreground">
                  Last updated: {format(lastUpdate, "dd.MM.yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

async function DirectoryContent({ path }: { path: string[] }) {
  const collection = await CollectionInfo.getDirectory(path)

  return <>Directory content</>
}

async function FileContent({ path }: { path: string[] }) {
  const source = await CollectionInfo.getFile(path, "mdx")

  const frontmatter = await source.getExportValue("frontmatter")
  const headings = await source.getExportValue("headings")
  const lastUpdate = await source.getLastCommitDate()
  const breadcrumbItems = await getBreadcrumbItems(path)

  const sections = await source.getSiblings()

  const Content = await source.getExportValue("default")

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
            <SiteBreadcrumb items={breadcrumbItems} />

            <div data-pagefind-body>
              <h1
                className="no-prose mb-2 scroll-m-20 text-4xl font-light tracking-tight lg:text-5xl"
                data-pagefind-meta="title"
              >
                {frontmatter.title ?? source.getTitle()}
              </h1>
              <p className="mb-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                {frontmatter.description ?? ""}
              </p>
              <article>
                <div
                  className={cn(
                    // default prose
                    "prose dark:prose-invert",
                    // remove backtick from inline code block
                    "prose-code:before:hidden prose-code:after:hidden",
                    // use full width
                    "max-w-auto w-full min-w-full",
                    "grow",

                    "prose-table:my-0",
                    "prose-th:pb-0",

                    "xl:prose-headings:scroll-mt-20",
                    "prose-headings:scroll-mt-28",

                    "prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight",
                    "prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight",
                    "prose-h4:text-xl prose-h4:font-semibold prose-h4:tracking-tight",

                    "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
                    "prose-p:leading-7 prose-p:[&:not(:first-child)]:mt-6",

                    "prose-ul:ml-6 prose-ul:list-disc prose-ul:[&>li]:mt-2 prose-ul:[&>ul]:my-2 prose-ul:[&>ul]:ml-0",
                  )}
                >
                  <Content />
                </div>

                {/* <SectionGrid sections={sections} /> */}
              </article>
            </div>
            {/* <Siblings source={source} collectionName={path[0]} /> */}

            <div>
              <Comments />
            </div>
          </div>
          <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
            <TableOfContents toc={headings} />

            <div className="my-6 grid gap-y-4 border-t pt-6">
              <div>
                <a
                  href={source.getEditUrl()}
                  target="_blank"
                  className="flex items-center text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
                >
                  Edit this page <ExternalLinkIcon className="ml-2 h-4 w-4" />
                </a>
              </div>

              {lastUpdate && (
                <div className="text-sm text-muted-foreground">
                  Last updated: {format(lastUpdate, "dd.MM.yyyy")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
