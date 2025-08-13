import type { EntryType } from "@/collections"
import { notFound } from "next/navigation"
import { getBreadcrumbItems, getFileContent, getSections } from "@/collections"
import { SiteBreadcrumb } from "@/components/breadcrumb"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import {
  MobileTableOfContents,
  TableOfContents,
} from "@/components/table-of-contents"
import { cn } from "@/lib/utils"
import { format } from "date-fns/format"
import { ExternalLinkIcon } from "lucide-react"

export async function FileContent({ source }: { source: EntryType }) {
  // maybe this is obsolete, since we called them earlier in the `DocsPage` component
  // but to have a similiar behaviour as we have in the `DirectoryContent` component
  // we use `source` as input and we have to call the `getFileContent` again
  const file = await getFileContent(source)
  if (!file) {
    return notFound()
  }

  const frontmatter = await file.getExportValue("frontmatter")
  const headings = await file.getExportValue("headings")
  const createdAt = await source.getFirstCommitDate()
  const lastUpdate = await source.getLastCommitDate()
  const breadcrumbItems = await getBreadcrumbItems(file.getPathnameSegments())

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
            "mt-12 xl:mt-0": headings.length > 0 && frontmatter.showToc,
            "xl:grid-cols-[1fr_300px]": frontmatter.showToc,
            "xl:grid-cols-1": !frontmatter.showToc,
          })}
        >
          <div
            className={cn("mx-auto", {
              "w-full 2xl:w-6xl": !frontmatter.showToc,
              "w-full 2xl:w-4xl": frontmatter.showToc,
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
                    "prose-p:leading-7 not-first:prose-p:mt-6",
                    "prose-a:text-indigo-400 prose-a:hover:text-white",

                    "prose-ul:ml-6 prose-ul:list-disc [&>li]:prose-ul:mt-2 [&>ul]:prose-ul:my-2 [&>ul]:prose-ul:ml-0",
                  )}
                >
                  <Content />
                </div>

                <SectionGrid sections={sections} />
              </article>
            </div>
            <Siblings source={source} />
          </div>
          {frontmatter.showToc ? (
            <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pr-6 xl:pb-16">
              <TableOfContents toc={headings} />

              <div
                className={cn("my-6 grid gap-y-4", {
                  "border-t pt-6": headings.length > 0,
                })}
              >
                {createdAt && (
                  <div className="text-muted-foreground text-sm">
                    Created at: {format(createdAt, "dd.MM.yyyy")}
                  </div>
                )}
                {lastUpdate && (
                  <div className="text-muted-foreground text-sm">
                    Last updated: {format(lastUpdate, "dd.MM.yyyy")}
                  </div>
                )}
                <div className="text-muted-foreground justify-center text-sm">
                  {process.env.NODE_ENV === "development" ? (
                    <a
                      href={source.getEditorUri()}
                      className="hover:text-white"
                    >
                      View source{" "}
                      <ExternalLinkIcon className="inline h-4 w-4" />
                    </a>
                  ) : (
                    <a
                      href={source.getSourceUrl()}
                      target="_blank"
                      className="hover:text-white"
                    >
                      View source{" "}
                      <ExternalLinkIcon className="inline h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
