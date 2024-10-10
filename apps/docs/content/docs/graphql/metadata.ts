import type { CollectionSchema } from "@/collections";

import { GraphqlCollection } from "@/collections";

export const metadata: CollectionSchema["metadata"] = {
  title: "GraphQL docs",
  entrypoint: "/docs/graphql",
  alias: "graphql",
  collection: GraphqlCollection,
};
