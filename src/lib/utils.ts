import type { DocsSource } from "@/collections"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  order: string
  depth: number
  children?: TreeItem[]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

/** Create a slug from a string. */
// source: https://github.com/souporserious/renoun/blob/main/packages/renoun/src/utils/create-slug.ts
export function createSlug(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Add a hyphen between lower and upper case letters
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Add a hyphen between consecutive upper case letters followed by a lower case letter
    .replace(/[_\s]+/g, "-") // Replace underscores and spaces with a hyphen
    .toLowerCase() // Convert the entire string to lowercase
}
