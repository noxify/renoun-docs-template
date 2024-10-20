import type { FileSystemSource } from "renoun/collections"

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
}: {
  input: FileSystemSource<T>[]
  maxDepth?: number
}): Promise<TreeItem[]> {
  const tree: TreeItem[] = []
  for (const source of input) {
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
            })
          : [],
    }

    tree.push(treeItem)
  }
  return tree
}
