import { CollectionInfo } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
import { getTree } from "@/lib/utils"

export default async function DocsLayout(
  props: Readonly<{
    params: Promise<{
      slug: string[]
    }>
    children: React.ReactNode
  }>,
) {
  const params = await props.params

  // based on our configuration in `src/collections`,
  // `collections` returns the complete list of all the available pages
  // and depths ( starting at 1 which defines the root level ( e.g. 'aria-docs' or `renoun-docs`))
  const collections = await CollectionInfo.getSources()

  // here we're generating the items for the dropdown menu in the sidebar
  // it's used to provide a short link for the user to switch easily between the different collections
  // it expects an `index.mdx` file in each collection at the root level ( e.g. `aria-docs/index.mdx`)
  const collectionMeta = collections
    .filter((ele) => ele.getDepth() === 1)
    .filter((ele) => ele.isFile())

  const collectionChooser = []
  for (const collection of collectionMeta) {
    const meta = await collection.getExport("frontmatter").getValue()
    collectionChooser.push({
      title: meta?.title ?? collection.getTitle(),
      // if you don't want to redirect the user to a specific page
      // and you haven't defined an entrypoint, then we will use the current path as an entry point
      entrypoint: meta?.entrypoint ?? collection.getPath(),
      // the alias is used as identifier for the active state in the dropdown
      // not sure if there is a use case to have a different alias than the collection name
      // as fallback we will use the collection name based on the returned array from `collection.getPathSegments`
      alias: meta?.alias ?? collection.getPathSegments()[1],
    })
  }

  const treeItems = collections
    // to get only the relevant menu entries, we have to filter the list of collections
    // based on the provided slug ( via `params.slug` ) and the path segments for the current source in the iteration
    .filter((collection) => collection.getPathSegments()[1] === params.slug[0])
    // since we generated the nested tree later in the code ( via `getTree` )
    // we can filter the list of collections based on the depth which should be shown as "root"
    // in our case, we filter the list of collections based on depth 2
    .filter((ele) => ele.getDepth() === 2)

  const sidebarItems = await getTree({
    input: treeItems,
    maxDepth: 4,
  })

  return (
    <SidebarLayout>
      <SiteSidebar
        items={sidebarItems}
        collections={collectionChooser}
        activeCollection={params.slug[0]}
      />

      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        {props.children}
      </main>
    </SidebarLayout>
  )
}
