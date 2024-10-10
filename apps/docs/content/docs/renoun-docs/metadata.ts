import type { CollectionSchema } from "~/collections";
import { RenounDocsCollection } from "~/collections";

export const metadata: CollectionSchema["metadata"] = {
  title: "Renoun docs",
  entrypoint: "/docs/renoun-docs",
  alias: "renoun-docs",
  collection: RenounDocsCollection,
};
