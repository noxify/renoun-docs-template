import { notFound } from "next/navigation";

import { SidebarLayout } from "@acme/ui/sidebar";

import { SiteSidebar } from "~/components/sidebar";
import { collectionChooser, getCollectionInfo } from "~/lib/collections";
import { getTree } from "~/lib/tree";

export default async function DocsLayout({
  params,
  children,
}: Readonly<{
  params: {
    product: string;
    slug: string[];
  };
  children: React.ReactNode;
}>) {
  const chooser = await collectionChooser();

  const collections = await getCollectionInfo();
  const collection = collections.find(
    (collection) => collection.alias === params.slug[0],
  )?.collection;

  if (!collection) {
    return notFound();
  }

  const items = await getTree({
    input: collection,
    maxDepth: 4,
  });

  return (
    <SidebarLayout>
      <SiteSidebar
        items={items}
        collections={chooser}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        activeCollection={params.slug[0]!}
      />

      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="container py-6">{children}</div>
      </main>
    </SidebarLayout>
  );
}
