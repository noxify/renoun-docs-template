import type { CollectionSchema } from "@/collections";

import { CollectionInfo } from "@/collections";

export async function getCollectionInfo() {
  const collections = await CollectionInfo.getSources();

  return await Promise.all(
    collections.map((collection) =>
      collection.getExport("metadata").getValue(),
    ),
  );
}

export async function collectionChooser() {
  const collections = await CollectionInfo.getSources();

  const elements: Omit<CollectionSchema["metadata"], "collection">[] = [];

  for (const collection of collections) {
    const meta = await collection.getExport("metadata").getValue();
    elements.push({
      title: meta.title,
      entrypoint: meta.entrypoint,
      alias: meta.alias,
    });
  }
  return elements;
}
