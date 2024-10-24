"use client"

import type { DocsSource } from "@/collections"
import { resolveHref } from "next/dist/client/resolve-href"
import Router from "next/router"
import multimatch from "multimatch"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  order: string
  depth: number
  children?: TreeItem[]
}

export function isActive(
  currentPath: string | string[],
  checkPath: string | string[],
) {
  return multimatch(currentPath, checkPath).length > 0
}

export const current = ({
  pathname,
  item,
}: {
  pathname: string
  item: TreeItem
}) => {
  const active = isActive(
    pathname,
    [item.path, ...(item.children ?? []).map((ele) => ele.path)]
      .map((ele) => {
        const resolvedUrl = resolveHref(Router, ele)
        return [resolvedUrl, `${resolvedUrl}/**`]
      })
      .flat(),
  )

  return active
}

export async function getTree({
  input,
  maxDepth = 2,
}: {
  input: DocsSource[]
  maxDepth?: number
}): Promise<TreeItem[]> {
  const tree: TreeItem[] = []
  for (const source of input) {
    const frontmatter = !source.isDirectory()
      ? await source.getExport("frontmatter").getValue()
      : null

    const treeItem = {
      title: frontmatter?.navTitle ?? source.getTitle(),
      path: source.getPath(),
      isFile: source.isFile(),
      slug: source.getPathSegments(),
      order: source.getOrder(),
      depth: source.getDepth(),
      children:
        source.getDepth() <= maxDepth
          ? await getTree({
              input: await source.getSources({ depth: 1 }),
              maxDepth,
            })
          : [],
    }

    tree.push(treeItem)
  }
  return tree
}
