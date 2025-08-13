import type { EntryType } from "@/collections"
import type { Collection, FileSystemEntry } from "renoun/file-system"
import Link from "next/link"
import { DocumentationGroup, isHidden } from "@/collections"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { isDirectory, isFile } from "renoun/file-system"

export default async function Siblings({ source }: { source: EntryType }) {
  const [previousPage, nextPage] = await getSiblings(source, {
    entryGroup: DocumentationGroup,
  })

  const previousPageFrontmatter = previousPage
    ? isFile(previousPage, "mdx")
      ? await previousPage.getExportValue("frontmatter")
      : null
    : null

  const nextPageFrontmatter = isFile(nextPage, "mdx")
    ? await nextPage.getExportValue("frontmatter")
    : null

  if (!previousPage && !nextPage) {
    return <></>
  }

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t pt-6"
      data-pagefind-ignore
    >
      <div className="flex w-0 flex-1">
        {previousPage && (
          <>
            <Link
              prefetch={true}
              href={`/docs${previousPage.getPathname()}`}
              className="text-gray-700"
              title={`Go to previous page: ${previousPageFrontmatter?.navTitle ?? previousPage.getTitle()}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <ChevronLeftIcon className="h-5 w-5 flex-none text-gray-500 transition-colors duration-200 group-hover:text-indigo-400 dark:text-gray-400 dark:group-hover:text-white" />
                <div className="flex flex-col items-start">
                  <p className="text-xs leading-5 text-gray-500">
                    Previous page
                  </p>
                  <p className="text-sm leading-5 font-medium text-gray-500 transition-colors duration-200 group-hover:text-indigo-400 dark:text-gray-400 dark:group-hover:text-white">
                    {previousPageFrontmatter?.navTitle ??
                      previousPage.getTitle()}
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
              prefetch={true}
              href={`/docs${nextPage.getPathname()}`}
              className="text-gray-700"
              title={`Go to next page: ${nextPageFrontmatter?.navTitle ?? nextPage.getTitle()}`}
            >
              <div className="group flex shrink-0 items-center gap-x-4">
                <div className="flex flex-col items-end">
                  <p className="text-xs leading-5 text-gray-500">Next page</p>
                  <p className="group-hover:text-foreground text-sm leading-5 text-gray-500 transition-colors duration-200 dark:text-gray-400 dark:group-hover:text-white">
                    {nextPageFrontmatter?.navTitle ?? nextPage.getTitle()}
                  </p>
                </div>
                <ChevronRightIcon className="group-hover:text-foreground h-5 w-5 flex-none text-gray-500 transition-colors duration-200 dark:text-gray-400 dark:group-hover:text-white" />
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
    entryGroup: Collection<GroupTypes, FileSystemEntry<any>[]>
    includeAll?: boolean
  },
): Promise<[EntryType | undefined, EntryType | undefined]> {
  let entries = await options.entryGroup.getEntries({
    recursive: true,
    includeIndexAndReadmeFiles: false,
  })

  if (!options.includeAll) {
    entries = entries.filter(
      (ele) => ele.getPathnameSegments()[0] == source.getPathnameSegments()[0],
    )
  }

  entries = entries.filter(
    (ele) => !isHidden(ele) && (isDirectory(ele) || isFile(ele, "mdx")),
  )

  let currentPath = ""

  if (isFile(source) && source.getBaseName() === "index") {
    currentPath = source.getParent().getPathname()
  } else {
    currentPath = source.getPathname()
  }

  const currentIndex = entries.findIndex(
    (ele) => ele.getPathname() === currentPath,
  )

  const previousElement =
    currentIndex > 0 ? entries[currentIndex - 1] : undefined

  const nextElement =
    currentIndex < entries.length - 1 ? entries[currentIndex + 1] : undefined

  return [previousElement, nextElement]
}
