import { Directory, withSchema } from "renoun/file-system"

import { docSchema } from "./validations"

type ElementType<T extends readonly unknown[]> =
  T extends readonly (infer ElementType)[] ? ElementType : never

const sources = [
  "aria-docs",
  "renoun-docs",
  "test-collection",
  "test2",
  "test3",
  "test4",
  "test5",
  "test6",
  "test7",
  "test8",
  //"test9",
  //"test10",
  //"test11",
  //"test12",
  //"test13",
] as const

export function generateDirectories() {
  return sources.map((directory) => {
    return new Directory({
      path: `content/${directory}`,
      basePath: directory,
      // hide hidden files ( starts with `_` ) and all asset directories ( `_assets` )
      include: (entry) =>
        !entry.getBaseName().startsWith("_") &&
        !entry.getAbsolutePath().includes("_assets"),
      loaders: {
        mdx: withSchema(
          docSchema,
          (path) => import(`../content/${directory}/${path}.mdx`),
        ),
      },
    })
  })
}

export type AllowedGroupName = ElementType<typeof sources>
