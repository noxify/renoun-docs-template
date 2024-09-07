import type { AvailableCollections } from "@/collections"
import { collections } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"
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
  const collection = collections[params.slug[0] as AvailableCollections]

  const items = await getTree({
    input: collection,
    maxDepth: 3,
  })

  return (
    <SidebarLayout>
      <SiteSidebar items={items} />

      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="container py-6">{children}</div>
      </main>
    </SidebarLayout>
  )
}
