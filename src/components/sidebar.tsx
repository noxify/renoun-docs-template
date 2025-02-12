"use client"

import type { TreeItem } from "@/lib/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/docs-navigation"
import { headerNavigation } from "@/components/main-navbar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { current } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function SiteSidebar({
  items,
  collections,
  activeCollection,
  hideSwitcher,
  defaultHidden,
}: {
  items: TreeItem[]
  collections: {
    title: string
    entrypoint: string
    alias: string
  }[]
  activeCollection: string
  hideSwitcher?: boolean
  defaultHidden?: boolean
}) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <Sidebar className="lg:mt-12" defaultHidden={defaultHidden}>
      {!hideSwitcher && (
        <SidebarHeader>
          <DropdownMenu>
            <DropdownMenuTrigger className="ring-ring hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent w-full rounded-md focus-visible:ring-2 focus-visible:outline-hidden">
              <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
                <div className="line-clamp-1 flex-1 pr-2 font-medium">
                  {
                    collections.find((ele) => ele.alias == activeCollection)
                      ?.title
                  }
                </div>
                <ChevronsUpDown className="text-muted-foreground/50 ml-auto h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Collections
              </DropdownMenuLabel>
              {collections.map((collection, index) => (
                <DropdownMenuItem
                  key={index}
                  className="items-start gap-2 px-1.5"
                  asChild
                >
                  <Link href={collection.entrypoint} prefetch={true}>
                    <div className="grid flex-1 leading-tight">
                      <div className="line-clamp-1 font-medium">
                        {collection.title}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarHeader>
      )}
      <SidebarContent>
        <SidebarItem className="border-b pb-5 lg:hidden">
          <SidebarLabel>Navigation</SidebarLabel>
          <Navigation
            items={headerNavigation as TreeItem[]}
            highlightActive={false}
          />
        </SidebarItem>
        {items.map((item) => {
          if (item.children) {
            return (
              <SidebarItem key={item.path}>
                {item.isFile && item.children.length === 0 && (
                  <Link
                    href={item.path}
                    prefetch={true}
                    className={cn(
                      "text-muted-foreground ring-ring hover:text-accent-foreground flex min-w-8 flex-1 items-center p-1.5 text-sm outline-hidden transition-all focus-visible:ring-2",
                      current({ pathname, item })
                        ? "bg-muted rounded-sm"
                        : "hover:bg-muted hover:rounded-sm",
                    )}
                  >
                    {item.title}
                  </Link>
                )}
                {((item.isFile && item.children.length > 0) ||
                  !item.isFile) && (
                  <Link
                    href={item.path}
                    prefetch={true}
                    className={cn(
                      "hover:bg-muted flex flex-1 py-1.5 hover:rounded-sm",
                    )}
                  >
                    <SidebarLabel>{item.title}</SidebarLabel>
                  </Link>
                )}

                <Navigation items={item.children} className="mb-4" />
              </SidebarItem>
            )
          }
        })}
      </SidebarContent>
    </Sidebar>
  )
}
