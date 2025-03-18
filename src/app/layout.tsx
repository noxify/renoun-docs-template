import type { Metadata } from "next"

import "./globals.css"

import { Suspense } from "react"
import { Navbar } from "@/components/main-navbar"
import { SiteSidebar } from "@/components/sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { PackageInstallScript, ThemeStyles } from "renoun/components"

export const metadata: Metadata = {
  title: {
    default: "renoun docs template",
    template: "%s | renoun docs template",
  },
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const availableCollections = []

  availableCollections.unshift({
    name: "All",
    pattern: "**/*",
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeStyles />
        <PackageInstallScript />
        <ThemeProvider
          attribute={["class", "data-theme"]}
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
