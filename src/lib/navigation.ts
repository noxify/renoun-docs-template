import type { EntryType } from "@/collections"
import { getFileContent } from "@/collections"
import { isDirectory, isFile } from "renoun/file-system"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  depth: number
  children?: TreeItem[]
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

// source:
// https://github.com/souporserious/renoun/blob/main/packages/renoun/src/file-system/index.test.ts
async function buildTreeNavigation(entry: EntryType): Promise<TreeItem | null> {
  if (isDirectory(entry)) {
    return {
      title: entry.getTitle(),
      path: entry.getPath(),
      isFile: isFile(entry),
      slug: entry.getPathSegments(),
      depth: entry.getDepth(),
      children: isDirectory(entry)
        ? (
            await Promise.all(
              (await entry.getEntries()).map(buildTreeNavigation),
            )
          ).filter((ele) => !!ele)
        : [],
    }
  } else {
    const file = await getFileContent(entry)
    if (!file) {
      return null
    }

    const frontmatter = await file.getExportValue("frontmatter")
    return {
      title: frontmatter.navTitle ?? entry.getTitle(),
      path: entry.getPath(),
      isFile: isFile(entry),
      slug: entry.getPathSegments(),
      depth: entry.getDepth(),
      children: [],
    }
  }
}

export async function getTree(sources: EntryType[]): Promise<TreeItem[]> {
  return (await Promise.all(sources.map(buildTreeNavigation))).filter(
    (ele) => !!ele,
  )
}
