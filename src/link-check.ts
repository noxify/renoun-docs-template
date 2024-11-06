import { inspect } from "util"

import { CollectionInfo } from "./collections"

const transformedCollections = async () => {
  const collections = await CollectionInfo.getSources({ depth: Infinity })

  const result = []
  for (const collection of collections) {
    const filePath = collection.getFileSystemPath()
    const fileHeadings = collection.isFile()
      ? await collection.getExport("headings").getValue()
      : []

    const slug = collection.getPathSegments()

    result.push({
      filePath,
      fileHeadings,
      slug,
    })
  }

  return result
}

const collections = await transformedCollections()

console.log(inspect(collections))
