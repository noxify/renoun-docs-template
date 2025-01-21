import type { getSections } from "@/collections"
import Link from "next/link"
import { getFileContent } from "@/collections"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { removeFromArray } from "@/lib/utils"
import { isDirectory } from "renoun/file-system"

export default async function SectionGrid({
  sections,
}: {
  sections: Awaited<ReturnType<typeof getSections>>
}) {
  const elements = []

  for (const section of sections) {
    if (isDirectory(section)) {
      elements.push({
        title: section.getTitle(),
        description: "",
        path: `/docs/${removeFromArray(section.getPathSegments(), ["index"]).join("/")}`,
      })
    } else {
      const file = await getFileContent(section)

      if (!file) {
        continue
      }
      const frontmatter = await file.getExportValue("frontmatter")

      // in case we have an index file inside a directory
      // we have also to fetch the directory name, otherwise we get "Index" as title
      // if there is no `frontmatter.navTitle` defined
      const parentTitle = section.getPathSegments().includes("index")
        ? section.getParent().getTitle()
        : null

      elements.push({
        title: frontmatter.navTitle ?? parentTitle ?? section.getTitle(),
        description: frontmatter.description ?? "",
        path: `/docs/${removeFromArray(section.getPathSegments(), ["index"]).join("/")}`,
      })
    }
  }

  return (
    <div
      className="mt-12 grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      data-pagefind-ignore
    >
      {elements.map((ele, index) => {
        return (
          <Card
            key={index}
            className="group transition-colors hover:bg-muted/50"
          >
            <Link href={ele.path}>
              <CardHeader>
                <CardTitle className="group-hover:text-blue-500 group-hover:transition-colors">
                  {ele.title}
                </CardTitle>
              </CardHeader>
              <CardContent>{ele.description}</CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
