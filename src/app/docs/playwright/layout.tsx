import { collections /*PlaywrightCollection*/ } from "@/collections"
import { SiteSidebar } from "@/components/sidebar"
import { SidebarLayout } from "@/components/ui/sidebar"

// import { getPlaywrightTests } from "@/lib/playwright"
// import { getTree } from "@/lib/tree"
// import { cache } from "react"

// const cachedPlaywrightTests = cache(getPlaywrightTests)

export default /*async*/ function DocsLayout({
  children,
}: Readonly<{
  params: {
    slug: string[]
  }
  children: React.ReactNode
}>) {
  // const testcases = await cachedPlaywrightTests()

  // const testTags = testcases
  //   .map((test) => test.tags)
  //   .flatMap((ele) => ele.join(":"))
  return (
    <SidebarLayout>
      <SiteSidebar
        items={[
          {
            depth: 0,
            title: "Blog Tests",
            isFile: false,
            order: "1",
            path: "",
            slug: ["docs", "playwright", "blog"],
            children: [
              {
                depth: 0,
                title: "Create Tests",
                isFile: true,
                order: "1",
                path: "/docs/playwright/blog/create/",
                slug: ["docs", "playwright", "blog", "create"],
                children: [],
              },
              {
                depth: 0,
                title: "Update Tests",
                isFile: true,
                order: "1",
                path: "/docs/playwright/blog/update/",
                slug: ["docs", "playwright", "blog", "update"],
                children: [],
              },
            ],
          },
          {
            depth: 0,
            title: "Article Tests",
            isFile: false,
            order: "2",
            path: "",
            slug: ["docs", "playwright", "article"],
            children: [
              {
                depth: 0,
                title: "Create Tests",
                isFile: true,
                order: "1",
                path: "/docs/playwright/article/create/",
                slug: ["docs", "playwright", "article", "create"],
                children: [],
              },
              {
                depth: 0,
                title: "Update Tests",
                isFile: true,
                order: "1",
                path: "/docs/playwright/article/update/",
                slug: ["docs", "playwright", "article", "update"],
                children: [],
              },
            ],
          },
        ]}
        collections={Object.keys(collections)}
        activeCollection={"playwright"}
      />

      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="container py-6">{children}</div>
      </main>
    </SidebarLayout>
  )
}
