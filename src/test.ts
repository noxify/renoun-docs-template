import { inspect } from "node:util"

import { CollectionInfo } from "./collections"

// const collections = await CollectionInfo.getSources()

// for (const collection of collections) {
//   console.log(
//     inspect(
//       { segments: collection.getPathSegments(), path: collection.getPath() },
//       { depth: 2 },
//     ),
//   )
// }

const collection = CollectionInfo.getSource("/docs/renoun-docs/index")

console.log({ collection: collection?.getPath() })
