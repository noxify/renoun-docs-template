import type { DocSchema } from "@/collections"
import { DocsCollection } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getTree } from "@/lib/tree"

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const items = await getTree<DocSchema>({ input: DocsCollection })
  return (
    <>
      <SiteSidebar items={items} />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </>
  )
}
