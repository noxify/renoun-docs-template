import type { Metadata } from "next"

import "./globals.css"

import { Suspense } from "react"
import { CollectionInfo } from "@/collections"
import { Navbar } from "@/components/main-navbar"
import { SiteSidebar } from "@/components/sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { PackageInstallScript } from "renoun/components"

export const metadata: Metadata = {
  title: {
    default: "renoun docs template",
    template: "%s | renoun docs template",
  },
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const collections = await CollectionInfo.getEntries({
    recursive: false,
    includeIndexAndReadme: true,
  })

  const availableCollections = []

  for (const collection of collections) {
    try {
      const indexFile = await collection.getFile("index", "mdx")

      const frontmatter = await indexFile.getExportValue("frontmatter")

      availableCollections.push({
        name: frontmatter.title ?? indexFile.getTitle(),
        pattern: `/docs/${frontmatter.alias ?? collection.getPathSegments()[1]}/**`,
      })
    } catch (e: unknown) {
      console.log(e)
    }
  }

  availableCollections.unshift({
    name: "All",
    pattern: "**/*",
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <PackageInstallScript />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div />}>
            <Navbar tabs={availableCollections} />
          </Suspense>

          <SiteSidebar
            items={[]}
            collections={[]}
            activeCollection=""
            hideSwitcher={true}
            defaultHidden={true}
          />

          {children}
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
