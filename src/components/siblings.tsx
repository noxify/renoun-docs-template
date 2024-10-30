import type { DocsSource } from "@/collections"
import Link from "next/link"
import { CollectionInfo } from "@/collections"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default async function Siblings({
  source,
  collectionName,
}: {
  source: DocsSource | undefined
  collectionName: string
}) {
  if (!source) {
    return <></>
  }

  const collections = await CollectionInfo.getSources({ depth: Infinity })

  const collectionItems = collections
    .filter((collection) => collection.getPathSegments()[1] === collectionName)
    .filter((ele) => ele.getDepth() >= 2)

  const currentCollectionItem = collectionItems.find(
    (ele) => ele.getPath() === source.getPath(),
  )

  if (!currentCollectionItem) {
    return <></>
  }

  const [previousPage, nextPage] = await currentCollectionItem.getSiblings()

  const previousPageFrontmatter = previousPage?.isFile()
    ? await previousPage.getExport("frontmatter").getValue()
    : null

  const nextPageFrontmatter = nextPage?.isFile()
    ? await nextPage.getExport("frontmatter").getValue()
    : null

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t pt-6"
      data-pagefind-ignore
    >
      <div className="flex w-0 flex-1">
        {previousPage && previousPage.getDepth() > 1 && (
          <>
            <Link
              href={previousPage.getPath()}
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
        {nextPage && nextPage.getDepth() > 1 && (
          <>
            <Link
              href={nextPage.getPath()}
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
