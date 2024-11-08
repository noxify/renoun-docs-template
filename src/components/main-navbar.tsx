import Link from "next/link"
import { CollectionInfo } from "@/collections"
import { SheetClose } from "@/components/ui/sheet"
import { GithubIcon, HexagonIcon } from "lucide-react"

import { CanarySearch } from "./canary-search"
import { ThemeToggle } from "./theme-toggle"
import { buttonVariants } from "./ui/button"
import { SidebarTrigger } from "./ui/sidebar"

export const headerNavigation = [
  {
    title: "Home",
    path: `/`,
  },
  {
    title: "Aria Docs",
    path: `/docs/aria-docs/getting-started/introduction/`,
  },
  {
    title: "renoun Docs",
    path: `/docs/renoun-docs/getting-started/`,
  },
]

export function Navbar({
  tabs,
}: {
  tabs: { name: string; pattern: string }[]
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-2">
        <nav
          className="mx-auto flex h-12 items-center justify-between"
          aria-label="Global"
        >
          <div className="flex items-center gap-6">
            <div className="flex">
              <Logo />
            </div>
            <div className="hidden items-center gap-5 text-sm font-medium text-muted-foreground lg:flex">
              <NavMenu />
            </div>
          </div>
          <div className="flex gap-2">
            <SidebarTrigger />
            <CanarySearch tabs={tabs} />
            <ThemeToggle />
            <Link
              href="https://github.com/noxify/renoun-docs-template"
              target="_blank"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <HexagonIcon className="h-7 w-7 fill-current text-muted-foreground" />
      <h2 className="text-md font-bold">renoun Template</h2>
    </Link>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {headerNavigation.map((item) => {
        const Comp = (
          <Link
            key={item.title + item.path}
            className="flex items-center gap-1"
            href={item.path}
          >
            {item.title}{" "}
          </Link>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.path} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
