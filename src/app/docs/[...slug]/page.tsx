import type { DocSchema } from "@/config/collections"
import type {
  CollectionSource,
  FileExports,
  FileSystemSource,
} from "mdxts/collections"
import { notFound } from "next/navigation"
import SectionGrid from "@/components/section-grid"
import Siblings from "@/components/siblings"
import { DocsCollection } from "@/config/collections"

export async function generateStaticParams() {
  const sources = await DocsCollection.getSources()

  return (
    sources
      //.filter((source) => source.isFile())
      .map((source) => ({ slug: source.getPathSegments() }))
  )
}
interface TreeItem {
  title: string
  path: string
  slug: string[]
  order: string
  depth: number
  children?: TreeItem[]
}

async function getTree<T extends FileExports>({
  input,
  maxDepth = 2,
  fromSource = false,
}: {
  input: CollectionSource<T> | FileSystemSource<T>[]
  maxDepth?: number
  fromSource?: boolean
}): Promise<TreeItem[]> {
  let sources: FileSystemSource<T>[]
  if (fromSource) {
    sources = input as FileSystemSource<T>[]
  } else {
    sources = await (input as CollectionSource<T>).getSources({ depth: 1 })
  }

  const tree: TreeItem[] = []
  for (const source of sources) {
    const treeItem = {
      title: source.getTitle(),
      path: source.getPath(),
      slug: source.getPathSegments(),
      order: source.getOrder(),
      depth: source.getDepth(),
      children:
        source.getDepth() <= maxDepth
          ? await getTree<T>({
              input: await source.getSources({ depth: 1 }),
              maxDepth,
              fromSource: true,
            })
          : [],
    }
    tree.push(treeItem)
  }
  return tree
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

  const tree = await getTree<DocSchema>({ input: DocsCollection })

  console.log({ source: source })

  return (
    <>
      <h1>{source.getTitle()}</h1>
      <Content />

      <SectionGrid sections={sections} />

      <Siblings source={source} />
    </>
  )
}
