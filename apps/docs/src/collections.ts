import type { CollectionSource, FileSystemSource } from "renoun/collections";
import type { MDXContent } from "renoun/mdx";

import { collection } from "renoun/collections";

export interface DocSchema {
  default: MDXContent;
  frontmatter: {
    title: string;
    summary: string;
    tags?: string[];
    navTitle?: string;
  };
  headings: { text: string; id: string; depth: number }[];
}

export type DocsSource = FileSystemSource<DocSchema>;

export interface CollectionSchema {
  metadata: {
    title: string;
    entrypoint: string;
    alias: string;
    collection: CollectionSource<DocSchema>;
  };
}

export const AriaDocsCollection = collection<DocSchema>(
  {
    filePattern: "@content/docs/aria-docs/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/aria-docs",
    basePath: "docs/aria-docs",
  },
  (slug) => import(`../content/docs/aria-docs/${slug}.mdx`),
);

export const RenounDocsCollection = collection<DocSchema>(
  {
    filePattern: "@content/docs/renoun-docs/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/renoun-docs",
    basePath: "docs/renoun-docs",
  },
  (slug) => import(`../content/docs/renoun-docs/${slug}.mdx`),
);

export const PlaywrightCollection = collection<DocSchema>(
  {
    filePattern: "@content/docs/playwright/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/playwright",
    basePath: "docs/playwright",
  },
  (slug) => import(`../content/docs/playwright/${slug}.mdx`),
);

export const GraphqlCollection = collection<DocSchema>(
  {
    filePattern: "@content/docs/graphql/**/*.{tsx,mdx}",
    baseDirectory: "content/docs/graphql",
    basePath: "docs/graphql",
  },
  (slug) => import(`../content/docs/graphql/${slug}.mdx`),
);

export const CollectionInfo = collection<CollectionSchema>(
  {
    filePattern: "@content/docs/**/metadata.ts",
    baseDirectory: "content/docs",
    basePath: "docs",
  },
  (slug) => import(`../content/docs/${slug}.ts`),
);
