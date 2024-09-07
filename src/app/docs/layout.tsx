import type { DocSchema } from "@/collections"
import { DocsCollection } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar"
import { getTree } from "@/lib/tree"
import { SearchIcon } from "lucide-react"

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const items = await getTree<DocSchema>({ input: DocsCollection, maxDepth: 3 })
  return (
    <SidebarLayout>
      <SiteSidebar items={items} />
      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container">
            <nav
              className="mx-auto flex h-12 items-center justify-between"
              aria-label="Global"
            >
              <div></div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <SearchIcon className="h-4 w-4" />
                </Button>
                <SidebarTrigger />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>
        <div className="container py-6">{children}</div>
      </main>
    </SidebarLayout>
  )
}
