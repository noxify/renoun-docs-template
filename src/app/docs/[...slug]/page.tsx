import type { EntryType } from "@/collections"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionInfo, getFileContent, getSections } from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import { Comments } from "@/components/comments"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import {
  MobileTableOfContents,
  TableOfContents,
} from "@/components/table-of-contents"
import { cn, removeFromArray } from "@/lib/utils"
import { format } from "date-fns/format"
import { ExternalLinkIcon } from "lucide-react"
import { isDirectory } from "renoun/file-system"

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

async function getBreadcrumbItems(slug: string[]) {
  // we do not want to have "docs" as breadcrumb element
  // also, we do not need the index file in our breadcrumb
  const combinations = removeFromArray(slug, ["docs", "index"]).reduce(
    (acc: string[][], curr) => acc.concat(acc.map((sub) => [...sub, curr])),
    [[]],
  )

  const items = []

  for (const currentPageSegement of combinations) {
    let collection
    try {
      collection = await CollectionInfo.getEntry(currentPageSegement)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      continue
    }

    if (isDirectory(collection)) {
      items.push({
        title: collection.getTitle(),
        path: ["docs", ...collection.getPathSegments()],
      })
    } else {
      const file = await getFileContent(collection)

      if (!file) {
        continue
      }
      const frontmatter = await file.getExportValue("frontmatter")

      // in case we have an index file inside a directory
      // we have also to fetch the directory name, otherwise we get "Index" as title
      // if there is no `frontmatter.navTitle` defined
      const parentTitle = collection.getPathSegments().includes("index")
        ? collection.getParent().getTitle()
        : null

      items.push({
        title: frontmatter.navTitle ?? parentTitle ?? collection.getTitle(),
        path: [
          "docs",
          ...removeFromArray(collection.getPathSegments(), ["index"]),
        ],
      })
    }
  }

  return items
}

async function getParentTitle(slug: string[]) {
  const elements = await getBreadcrumbItems(slug)

  return elements.map((ele) => ele.title)
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

  let collection

  try {
    collection = await CollectionInfo.getEntry(params.slug)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    console.warn("Unable to get entry for path:", params.slug)
    return notFound()
  }

  if (isDirectory(collection)) {
    return <DirectoryContent source={collection} />
  }

  return <FileContent source={collection} />
}

async function DirectoryContent({ source }: { source: EntryType }) {
  const breadcrumbItems = await getBreadcrumbItems(source.getPathSegments())

  const sections = await getSections(source)

  return (
    <>
      <div className="container py-6">
        <div className={cn("flex flex-col gap-y-8")}>
          <div>
            <SiteBreadcrumb items={breadcrumbItems} />

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
            </article>

            <Siblings source={source} />
          </div>
        </div>
      </div>
    </>
  )
}

async function FileContent({ source }: { source: EntryType }) {
  const file = await getFileContent(source)
  if (!file) {
    return notFound()
  }

  const frontmatter = await file.getExportValue("frontmatter")
  const headings = await file.getExportValue("headings")
  const lastUpdate = await source.getLastCommitDate()
  const breadcrumbItems = await getBreadcrumbItems(file.getPathSegments())

  const sections = await getSections(source)
  const Content = await file.getExportValue("default")

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

                <SectionGrid sections={sections} />
              </article>
            </div>
            <Siblings source={source} />

            <div>
              <Comments />
            </div>
          </div>
          <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
            <TableOfContents toc={headings} />

            <div className="my-6 grid gap-y-4 border-t pt-6">
              <div>
                <a
                  href={file.getEditUrl()}
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
