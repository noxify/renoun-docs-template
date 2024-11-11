import type { DocsSource } from "@/collections"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SectionGrid({
  sections,
}: {
  sections: DocsSource[] | undefined
}) {
  if (!sections) {
    return <></>
  }
  return (
    <div
      className="mt-12 grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
      data-pagefind-ignore
    >
      {sections.map(async (section, index) => {
        const description = section.isFile()
          ? ((await section.getExport("frontmatter").getValue())?.description ??
            "")
          : ""
        return (
          <Card
            key={index}
            className="group transition-colors hover:bg-muted/50"
          >
            <Link href={section.getPath()}>
              <CardHeader>
                <CardTitle className="group-hover:text-blue-500 group-hover:transition-colors">
                  {section.getTitle()}
                </CardTitle>
              </CardHeader>
              <CardContent>{description}</CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
