import { notFound } from "next/navigation"
import { CollectionInfo } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
import { collectionChooser, getCollectionInfo } from "@/lib/collections"
import { getTree } from "@/lib/tree"

export default async function DocsLayout({
  params,
  children,
}: Readonly<{
  params: {
    product: string
    slug: string[]
  }
  children: React.ReactNode
}>) {
  const collections = await CollectionInfo.getSources()

  console.log({ collections })

  const treeItems = collections.filter(
    (collection) => collection.getPathSegments()[1] === params.slug[0],
  )

  // const chooser = await collectionChooser()

  // const collections = await getCollectionInfo()
  // const collection = collections.find(
  //   (collection) => collection.alias === params.slug[0],
  // )?.collection

  // if (!collection) {
  //   return notFound()
  // }

  const items = await getTree({
    input: treeItems,
    maxDepth: 4,
  })

  return (
    <SidebarLayout>
      <SiteSidebar
        items={items}
        collections={[]}
        activeCollection={params.slug[0]}
      />

      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="container py-6">{children}</div>
      </main>
    </SidebarLayout>
  )
}
