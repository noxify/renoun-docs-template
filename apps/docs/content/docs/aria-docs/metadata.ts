import type { CollectionSchema } from "@/collections";

import { AriaDocsCollection } from "@/collections";

export const metadata: CollectionSchema["metadata"] = {
  title: "Aria docs",
  entrypoint: "/docs/aria-docs/getting-started/introduction/",
  alias: "aria-docs",
  collection: AriaDocsCollection,
};
