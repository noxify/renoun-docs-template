import type { EntryType, frontmatterSchema } from "@/collections"
import type { Metadata } from "next"
import type { z } from "zod"
import { cache } from "react"
import { notFound } from "next/navigation"
import {
  CollectionInfo,
  getFileContent,
  getSections,
  getTitle,
} from "@/collections"
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

const getBreadcrumbItems = cache(async (slug: string[]) => {
  // we do not want to have "index" as breadcrumb element
  const cleanedSlug = removeFromArray(slug, ["index"])

  const combinations = cleanedSlug.map((_, index) =>
    cleanedSlug.slice(0, index + 1),
  )

  const items = []

  for (const currentPageSegement of combinations) {
    let collection: EntryType
    let file: Awaited<ReturnType<typeof getFileContent>>
    let frontmatter: z.infer<typeof frontmatterSchema> | undefined
    try {
      collection = await CollectionInfo.getEntry(currentPageSegement)
      if (collection.getPathSegments().includes("index")) {
        file = await getFileContent(collection.getParent())
      } else {
        file = await getFileContent(collection)
      }

      frontmatter = await file?.getExportValue("frontmatter")
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      continue
    }

    if (!frontmatter) {
      items.push({
        title: collection.getTitle(),
        path: ["docs", ...collection.getPathSegments()],
      })
    } else {
      const title = getTitle(collection, frontmatter, true)
      items.push({
        title,
        path: [
          "docs",
          ...removeFromArray(collection.getPathSegments(), ["index"]),
        ],
      })
    }
  }

  return items
})

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const breadcrumbItems = await getBreadcrumbItems(params.slug)

  const titles = breadcrumbItems.map((ele) => ele.title)

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

  // check the current path if it's a valid file ( including index check for a directory )
  const file = await getFileContent(collection)

  // if we can't find an index file, but we have a valid directory
  // use the directory component for rendering
  if (!file && isDirectory(collection)) {
    return (
      <>
        <DirectoryContent source={collection} />
      </>
    )
  }

  // if we have a valid file ( including the index file )
  // use the file component for rendering
  if (file) {
    return (
      <>
        <FileContent source={collection} />
      </>
    )
  }

  // seems to be an invalid path
  return notFound()
}

async function DirectoryContent({ source }: { source: EntryType }) {
  const breadcrumbItems = await getBreadcrumbItems(source.getPathSegments())

  const sections = await getSections(source)

  return (
    <>
      <div className="container py-6">
        <div className={cn("gap-8 xl:grid")}>
          <div className="mx-auto w-full 2xl:w-6xl">
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
                  "prose-a:text-indigo-400 prose-a:hover:text-white",
                )}
              >
                <h1
                  className="no-prose mb-2 scroll-m-20 text-4xl font-light tracking-tight lg:text-5xl"
                  data-pagefind-meta="title"
                >
                  {source.getTitle()}
                </h1>
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
  // maybe this is obsolete, since we called them earlier in the `DocsPage` component
  // but to have a similiar behaviour as we have in the `DirectoryContent` component
  // we use `source` as input and we have to call the `getFileContent` again
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
        {headings.length > 0 && frontmatter.showToc && (
          <MobileTableOfContents toc={headings} />
        )}

        <div
          className={cn("gap-8 xl:grid", {
            "mt-12 xl:mt-0": frontmatter.showToc && headings.length > 0,
            "xl:grid-cols-[1fr_300px]":
              frontmatter.showToc && headings.length > 0,
            "xl:grid-cols-1": !frontmatter.showToc || headings.length == 0,
          })}
        >
          <div
            className={cn("mx-auto", {
              "w-full 2xl:w-6xl": !frontmatter.showToc || headings.length == 0,
              "w-full 2xl:w-4xl": frontmatter.showToc && headings.length > 0,
            })}
          >
            <SiteBreadcrumb items={breadcrumbItems} />

            <div data-pagefind-body>
              <h1
                className="no-prose mb-2 scroll-m-20 text-3xl font-light tracking-tight sm:text-4xl md:text-5xl"
                data-pagefind-meta="title"
              >
                {frontmatter.title ?? source.getTitle()}
              </h1>
              <p className="text-muted-foreground mb-8 text-lg font-medium text-pretty sm:text-xl/8">
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
                    "w-full max-w-auto min-w-full",
                    "grow",

                    "prose-table:my-0",
                    "prose-th:pb-0",

                    "xl:prose-headings:scroll-mt-20",
                    "prose-headings:scroll-mt-28",

                    "prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight",
                    "prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight",
                    "prose-h4:text-xl prose-h4:font-semibold prose-h4:tracking-tight",

                    "prose-blockquote:mt-6 prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:italic",
                    "prose-p:leading-7 not-first:prose-p:mt-6",

                    "prose-ul:ml-6 prose-ul:list-disc [&>li]:prose-ul:mt-2 [&>ul]:prose-ul:my-2 [&>ul]:prose-ul:ml-0",
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
          {frontmatter.showToc && headings.length > 0 ? (
            <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pr-6 xl:pb-16">
              <TableOfContents toc={headings} />

              <div className="my-6 grid gap-y-4 border-t pt-6">
                <div>
                  <a
                    href={file.getEditUrl()}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground flex items-center text-sm no-underline transition-colors"
                  >
                    Edit this page <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>

                {lastUpdate && (
                  <div className="text-muted-foreground text-sm">
                    Last updated: {format(lastUpdate, "dd.MM.yyyy")}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
