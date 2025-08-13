import { Directory, withSchema } from "renoun/file-system"

import { docSchema } from "./validations"

type ElementType<T extends readonly unknown[]> =
  T extends readonly (infer ElementType)[] ? ElementType : never

const sources = [
  "aria-docs",
  "renoun-docs",
  "test-collection",
  "performance-docs",
  "security-guides",
  "api-reference",
  "tutorials-hub",
  "best-practices",
] as const

export function generateDirectories() {
  return sources.map((directory) => {
    return new Directory({
      path: `content/${directory}`,
      basePathname: directory,
      // hide hidden files ( starts with `_` ) and all asset directories ( `_assets` )
      include: (entry) =>
        !entry.getBaseName().startsWith("_") &&
        !entry.getAbsolutePath().includes("_assets"),
      loader: {
        mdx: withSchema(
          docSchema,
          (path) => import(`../content/${directory}/${path}.mdx`),
        ),
      },
    })
  })
}

export type AllowedGroupName = ElementType<typeof sources>
