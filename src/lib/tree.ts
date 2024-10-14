import type { CollectionSource, FileSystemSource } from "renoun/collections"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  order: string
  depth: number
  children?: TreeItem[]
}

export async function getTree<T extends object>({
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
    const frontmatter = !source.isDirectory()
      ? //@ts-expect-error TODO: check how to fix this
        await source.getExport("frontmatter").getValue()
      : null

    const treeItem = {
      //@ts-expect-error TODO: check how to fix this
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      title: frontmatter?.navTitle ?? source.getTitle(),
      path: source.getPath(),
      isFile: source.isFile(),
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
