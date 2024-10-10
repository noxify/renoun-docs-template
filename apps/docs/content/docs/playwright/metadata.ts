import type { CollectionSchema } from "~/collections";
import { PlaywrightCollection } from "~/collections";

export const metadata: CollectionSchema["metadata"] = {
  title: "Playwright docs",
  entrypoint: "/docs/playwright",
  alias: "playwright",
  collection: PlaywrightCollection,
};
