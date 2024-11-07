import { readFileSync } from "fs"
import { printErrors, scanURLs, validateFiles } from "next-validate-link"

import { CollectionInfo } from "./collections"

function removeFromArray<T>(array: T[], valueToRemove: T[]): T[] {
  return array.filter((value) => !valueToRemove.includes(value))
}

const getDirectories = async () => {
  const collections = (
    await CollectionInfo.getSources({ depth: Infinity })
  ).filter((collection) => collection.isDirectory())

  const result = []
  for (const collection of collections) {
    const filePath = collection.getFileSystemPath()

    const slug = removeFromArray(collection.getPathSegments(), ["docs"])
    const url = collection.getPath()

    result.push({
      path: filePath,
      url,
      slug,
    })
  }

  return result
}

const getFiles = async () => {
  const collections = (
    await CollectionInfo.getSources({ depth: Infinity })
  ).filter((collection) => collection.isFile())

  const result = []
  for (const collection of collections) {
    const filePath = collection.getFileSystemPath()

    const slug = removeFromArray(collection.getPathSegments(), ["docs"])
    const url = collection.getPath()

    result.push({
      path: filePath,
      url,
      slug,
      content: readFileSync(filePath).toString(),
    })
  }

  return result
}

const files = await getFiles()
const directories = await getDirectories()

const scanned = await scanURLs({
  pages: ["docs/[...slug]/page.tsx"],
  populate: {
    "docs/[...slug]": [
      ...files.map((collection) => ({
        value: collection.slug,
        //hashes: [],
      })),
      ...directories.map((collection) => ({ value: collection.slug })),
    ],
  },
})

printErrors(
  await validateFiles(files, {
    scanned,
  }),
  true,
)
