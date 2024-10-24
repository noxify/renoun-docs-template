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
    <div className="mt-12 grid gap-4 lg:grid-cols-2" data-pagefind-ignore>
      {sections.map((section, index) => {
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
              <CardContent>Content</CardContent>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
