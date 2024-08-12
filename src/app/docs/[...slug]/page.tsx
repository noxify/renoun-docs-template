import { inspect } from "util"
import { notFound } from "next/navigation"
import { DocsSource } from "@/config/collections"

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const tree = DocsSource.tree()
  const paths = DocsSource.paths()
  const data = await DocsSource.get(params.slug)

  console.log(inspect(tree, { depth: 8 }), paths, data)
  if (!data) {
    notFound()
  }

  const { Content } = data

  return (
    <>
      <h2>{data.frontMatter.title}</h2>
      <div>{Content ? <Content /> : <>No Content</>}</div>
    </>
  )
}
