import type { Metadata } from "next"

import "./globals.css"

import { Navbar } from "@/components/main-navbar"
import { SiteSidebar } from "@/components/sidebar"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { PackageInstallScript } from "renoun/components"

export const metadata: Metadata = {
  title: "renoun docs template",
  description:
    "This is a nextjs template with renoun integration to render mdx content.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          <Navbar />

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
