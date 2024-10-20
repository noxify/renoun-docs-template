import type { DocSchema } from "@/collections"
import { CollectionInfo } from "@/collections"

export async function getCollectionInfo() {
  const collections = (await CollectionInfo.getSources()).filter((collection) =>
    collection.isFile(),
  )

  const result = []

  for (const collection of collections) {
    const meta = await collection.getExport("metadata").getValue()
    result.push({
      ...meta,
      collection: collection,
    })
  }

  return result
}

export async function collectionChooser() {
  const collections = (await CollectionInfo.getSources()).filter((collection) =>
    collection.isFile(),
  )

  const elements: DocSchema["metadata"][] = []

  for (const collection of collections) {
    const meta = await collection.getExport("metadata").getValue()
    elements.push({
      title: meta.title,
      entrypoint: meta.entrypoint,
      alias: meta.alias,
    })
  }
  return elements
}
