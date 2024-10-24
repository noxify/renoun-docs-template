With `renoun<5.5.0` I had a dedicated `metadata.ts` in each root docs folder ( e.g. `content/docs/aria-docs/metadata.ts` ).

These files were fetched via a "CollectionInfo" collection.

Inside the `metadata.ts` I had a reference to the collection which was used inside the `page.tsx` to get the correct content and to build the sidebar.

```ts
import type { CollectionSchema } from "@/collections"
import { AriaDocsCollection } from "@/collections"

export const metadata: CollectionSchema["metadata"] = {
  title: "Aria docs",
  entrypoint: "/docs/aria-docs/getting-started/introduction/",
  alias: "aria-docs",
  collection: AriaDocsCollection,
}
```

The generated collection ( CollectionInfo ), had the following structure:

```ts
const collection = {
  title: string,
  entrypoint: string,
  alias: string,
  collection: FileSystemSource
}[]
```

With `renoun>=5.5.0` we have now the possibility to merge all collections into one via `CompositeCollection`.

In the branch `use-composite`, you can find the updated configuration.
I moved the `export const metadata` from the `metadata.ts` into the root `index.mdx` and removed the `collection` property.

My plan/idea was to use the `CompositeCollection` and having the same functionality as I had before with the `metadata.ts`.

But it seems, that there are differences between how it works and how I expected it to work.

Do you think it's possible to do the following:

- Using the result of CompositeCollection as base
- Generating the paths for `generateStaticParams`
- Fetching the needed collection to generate the sidebar and show the correct content based on the path params
  - Currently I have used the first element from the provided `slug` to identify the correct collection
- Getting the metadata information from the `<collection-root>/index.mdx` to generate the available docs for the sidebar collection chooser

If this is not the right way, what would be a good approach or this the approach via the `metadata.ts` the "correct one"?

---

While testing how it could work, I noticed that the response of `CompositeCollection` is different to what I have expected/wanted.

```ts
const collections = await CollectionInfo.getSources()

for (const collection of collections) {
  console.log({ collection: collection.getPath() })
}
```

The output was:

```
{ collection: 'getting-started' }
{ collection: 'introduction' }
{ collection: 'installation' }
{ collection: 'gatsby' }
{ collection: 'laravel' }
{ collection: 'react' }
{ collection: 'quick-start-guide' }
{ collection: 'project-structure' }
{ collection: 'integrations' }
{ collection: 'layouts' }
{ collection: 'manual' }
{ collection: 'golang' }
{ collection: 'javascript' }
{ collection: 'typescript' }
{ collection: 'changelog' }
{ collection: 'faq' }
{ collection: 'react-hooks' }
{ collection: 'use-analytics' }
{ collection: 'use-auth' }
{ collection: 'use-cart' }
{ collection: 'use-data' }
{ collection: 'use-fetch' }
{ collection: 'use-inventory' }
{ collection: 'use-notification' }
{ collection: 'use-order' }
{ collection: 'use-payment' }
{ collection: 'use-product' }
{ collection: 'use-review' }
{ collection: 'use-router' }
{ collection: 'use-session' }
{ collection: 'use-settings' }
{ collection: 'use-shipping' }
{ collection: 'use-theme' }
{ collection: 'use-user' }
{ collection: 'server-actions' }
{ collection: 'getRole' }
{ collection: 'getSession' }
{ collection: 'getToken' }
{ collection: 'getting-started' }
{ collection: 'section-title' }
{ collection: 'introduction' }
{ collection: 'section-with-index' }
{ collection: 'introduction' }
```

Maybe grouping the result could solve it ( via parsing `getPathSegments()` and extracting the collection name ), but not sure if this is the right way.
