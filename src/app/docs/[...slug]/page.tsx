import { notFound } from "next/navigation"
import { DocsCollection } from "@/collections"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"

export async function generateStaticParams() {
  const sources = await DocsCollection.getSources()

  return sources
    .filter((source) => source.isFile())
    .map((source) => ({ slug: source.getPathSegments() }))
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const source = DocsCollection.getSource(params.slug)
  // if we can't find the source then return a 404
  if (!source) {
    return notFound()
  }
  const sections = await source.getSources({ depth: 1 })

  const Content = await source.getDefaultExport().getValue()

  return (
    <>
      <Content />

      <SectionGrid sections={sections} />

      <Siblings source={source} />
    </>
  )
}
