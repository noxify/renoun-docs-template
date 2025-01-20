import type { DocSchema } from "@/collections"
import type {
  FileSystemEntry,
  JavaScriptFileWithRuntime,
} from "renoun/file-system"
import {
  isDirectory,
  isFile,
  isJavaScriptFileWithRuntime,
} from "renoun/file-system"

export interface TreeItem {
  title: string
  path: string
  isFile: boolean
  slug: string[]
  depth: number
  children?: TreeItem[]
}

// export async function getTree({
//   input,
//   maxDepth = 2,
// }: {
//   input: DocsSource[]
//   maxDepth?: number
// }): Promise<TreeItem[]> {
//   const tree: TreeItem[] = []
//   for (const source of input) {
//     const frontmatter = !source.isDirectory()
//       ? await source.getExport("frontmatter").getValue()
//       : null

//     const treeItem = {
//       title: frontmatter?.navTitle ?? source.getTitle(),
//       path: source.getPath(),
//       isFile: source.isFile(),
//       slug: source.getPathSegments(),
//       order: source.getOrder(),
//       depth: source.getDepth(),
//       children:
//         source.getDepth() <= maxDepth
//           ? await getTree({
//               input: await source.getSources({ depth: 1 }),
//               maxDepth,
//             })
//           : [],
//     }

//     tree.push(treeItem)
//   }
//   return tree
// }

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
async function buildTreeNavigation<
  Entry extends FileSystemEntry<{ mdx: DocSchema }, true>,
>(entry: Entry): Promise<TreeItem> {
  let current
  if (isFile(entry)) {
    current = await entry.getParentDirectory().getFile(entry.getPath(), "mdx")
  } else {
    current = await entry.getFile("index", "mdx")
  }

  const frontmatter = await current?.getExportValue("frontmatter")

  return {
    title: frontmatter?.navTitle ?? entry.getTitle(),
    path: entry.getPath(),
    isFile: isFile(entry),
    slug: entry.getPathSegments(),
    depth: entry.getDepth(),
    children: isDirectory(entry)
      ? await Promise.all((await entry.getEntries()).map(buildTreeNavigation))
      : [],
  }
}

export async function getTree<
  Entry extends FileSystemEntry<{ mdx: DocSchema }, true>,
>(sources: Entry[]): Promise<TreeItem[]> {
  return await Promise.all(sources.map(buildTreeNavigation))
}
