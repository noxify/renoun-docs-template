// import { readFileSync } from "fs"
// import { toString } from "mdast-util-to-string"
// import { printErrors, scanURLs, validateFiles } from "next-validate-link"
// import remarkParse from "remark-parse"
// import { unified } from "unified"

// import { CollectionInfo } from "./collections"
// import { createSlug } from "./lib/utils"

// function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
//   return array.filter((value) => !valueToRemove.includes(value))
// }

// const getDirectories = async () => {
//   const collections = (
//     await CollectionInfo.getSources({ depth: Infinity })
//   ).filter((collection) => collection.isDirectory())

//   const result = []
//   for (const collection of collections) {
//     const filePath = collection.getFileSystemPath()

//     const slug = removeFromArray(collection.getPathSegments(), ["docs"])
//     const url = collection.getPath()

//     result.push({
//       path: filePath,
//       url,
//       slug,
//     })
//   }

//   return result
// }

// const getFiles = async () => {
//   const collections = (
//     await CollectionInfo.getSources({ depth: Infinity })
//   ).filter((collection) => collection.isFile())

//   const result = []
//   for (const collection of collections) {
//     const filePath = collection.getFileSystemPath()

//     const slug = removeFromArray(collection.getPathSegments(), ["docs"])
//     const url = collection.getPath()
//     const content = readFileSync(filePath).toString()

//     const file = unified()
//       .use(remarkParse)
//       // it seems that something is weird with the headings
//       // because the tree isn't updated with the id's
//       //.use({ plugins: remarkPlugins })
//       .parse(content)

//     const headinsFromTree = file.children.filter(
//       (node) => node.type === "heading",
//     )

//     // this is just a copy from
//     // https://github.com/souporserious/renoun/blob/main/packages/mdx/src/remark/add-headings.ts
//     const headingCounts = new Map()
//     const headings = headinsFromTree.map((node) => {
//       const text = node.children.map((child) => toString(child)).join("")
//       let id = createSlug(text)

//       if (headingCounts.has(id)) {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//         const count = headingCounts.get(id) + 1
//         headingCounts.set(id, count)
//         id = `${id}-${count}`
//       } else {
//         headingCounts.set(id, 1)
//       }

//       return {
//         text,
//         id,
//         depth: node.depth,
//       }
//     })

//     result.push({
//       path: filePath,
//       url,
//       slug,
//       content,
//       headings: headings.map((ele) => ele.id),
//     })
//   }

//   return result
// }

// const files = await getFiles()
// const directories = await getDirectories()

// const scanned = await scanURLs({
//   pages: ["docs/[...slug]/page.tsx"],
//   populate: {
//     "docs/[...slug]": [
//       ...files.map((collection) => ({
//         value: collection.slug,
//         hashes: collection.headings,
//       })),
//       ...directories.map((collection) => ({ value: collection.slug })),
//     ],
//   },
// })

// printErrors(
//   await validateFiles(files, {
//     scanned,
//   }),
//   true,
// )
