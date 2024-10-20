import { inspect } from "node:util"

import { CollectionInfo } from "./collections"

const collections = (await CollectionInfo.getSources()).map((collection) =>
  collection.getPathSegments(),
)

console.log({ collections })

// const collection = CollectionInfo.getSource("/docs/renoun-docs/index")

// console.log({ collection: collection?.getPath() })
