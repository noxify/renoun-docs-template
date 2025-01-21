import type { EntryType } from "@/collections"
import Link from "next/link"
import { CollectionInfo } from "@/collections"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { isFile } from "renoun/file-system"

export default async function Siblings({ source }: { source: EntryType }) {
  const [previousPage, nextPage] = await source.getSiblings({
    entryGroup: CollectionInfo,
  })

  const previousPageFrontmatter = isFile(previousPage, "mdx")
    ? await previousPage.getExportValue("frontmatter")
    : null

  const nextPageFrontmatter = isFile(nextPage, "mdx")
    ? await nextPage.getExportValue("frontmatter")
    : null

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t pt-6"
      data-pagefind-ignore
    >
      <div className="flex w-0 flex-1">
        {previousPage && (
          <>
            <Link
              href={`/docs${previousPage.getPath()}`}
              className="text-gray-700"
              title={`Go to previous page: ${previousPageFrontmatter?.navTitle ?? previousPage.getTitle()}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <ChevronLeftIcon className="h-5 w-5 flex-none text-gray-500 transition-colors duration-200 group-hover:text-foreground dark:text-gray-400" />
                <div className="flex flex-col items-start">
                  <p className="text-xs leading-5 text-gray-500">
                    Previous page
                  </p>
                  <p className="text-sm font-medium leading-5 text-gray-500 transition-colors duration-200 group-hover:text-foreground dark:text-gray-400">
                    {previousPage.getTitle()}
                  </p>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {nextPage && (
          <>
            <Link
              href={`/docs${nextPage.getPath()}`}
              className="text-gray-700"
              title={`Go to next page: ${nextPageFrontmatter?.navTitle ?? nextPage.getTitle()}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <div className="flex flex-col items-end">
                  <p className="text-xs leading-5 text-gray-500">Next page</p>
                  <p className="text-sm leading-5 text-gray-500 transition-colors duration-200 group-hover:text-foreground dark:text-gray-400">
                    {nextPage.getTitle()}
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-gray-500 transition-colors duration-200 group-hover:text-foreground dark:text-gray-400" />
              </div>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
