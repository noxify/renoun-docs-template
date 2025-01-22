import type { EntryType } from "@/collections"
import type { EntryGroup, FileSystemEntry } from "renoun/file-system"
import Link from "next/link"
import { CollectionInfo } from "@/collections"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { isFile } from "renoun/file-system"

export default async function Siblings({ source }: { source: EntryType }) {
  const [previousPage, nextPage] = await getSiblings(source, {
    entryGroup: CollectionInfo,
  })

  const previousPageFrontmatter = previousPage
    ? isFile(previousPage, "mdx")
      ? await previousPage.getExportValue("frontmatter")
      : null
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

// inspired by
// * https://github.com/souporserious/renoun/blob/main/packages/renoun/src/file-system/index.tsx#L497
async function getSiblings<
  GroupTypes extends Record<string, unknown> = Record<string, unknown>,
>(
  source: EntryType,
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entryGroup: EntryGroup<GroupTypes, FileSystemEntry<any>[]>
    includeAll?: boolean
  },
): Promise<[EntryType | undefined, EntryType | undefined]> {
  let entries = await options.entryGroup.getEntries({
    recursive: true,
    includeIndexAndReadme: false,
  })

  if (!options.includeAll) {
    entries = entries.filter(
      (ele) => ele.getPathSegments()[0] == source.getPathSegments()[0],
    )
  }

  let currentPath = ""

  if (isFile(source) && source.getBaseName() === "index") {
    currentPath = source.getParent().getPath()
  } else {
    currentPath = source.getPath()
  }

  for (const [index, entry] of entries.entries()) {
    console.log({ index, path: entry.getPath() })
  }

  const currentIndex = entries.findIndex((ele) => ele.getPath() === currentPath)

  const previousElement =
    currentIndex > 0 ? entries[currentIndex - 1] : undefined

  const nextElement =
    currentIndex < entries.length - 1 ? entries[currentIndex + 1] : undefined

  return [previousElement, nextElement]
}
