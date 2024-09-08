"use client"

import type { DocSchema, collections as omniCollections } from "@/collections"
import type { TreeItem } from "@/lib/tree"
import type { CollectionSource } from "omnidoc/collections"
import Link from "next/link"
import { Navigation } from "@/components/docs-navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, PlusIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function SiteSidebar({
  items,
  collections,
  activeCollection,
}: {
  items: TreeItem[]
  collections: string[]
  activeCollection: string
}) {
  return (
    <Sidebar className="mt-12">
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full rounded-md ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 data-[state=open]:bg-accent">
            <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
              <div className="line-clamp-1 flex-1 pr-2 font-medium">
                {activeCollection}
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64"
            align="start"
            side="right"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Collections
            </DropdownMenuLabel>
            {collections.map((element) => (
              <DropdownMenuItem
                key={element}
                className="items-start gap-2 px-1.5"
                asChild
              >
                <Link href={`/docs/${element}`}>
                  <div className="grid flex-1 leading-tight">
                    <div className="line-clamp-1 font-medium">{element}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        {items.map((item) => {
          if (item.children) {
            return (
              <SidebarItem key={item.path}>
                {item.isFile ? (
                  <Link href={item.path}>
                    <SidebarLabel>{item.title}</SidebarLabel>
                  </Link>
                ) : (
                  <SidebarLabel>{item.title}</SidebarLabel>
                )}
                <Navigation items={item.children} />
              </SidebarItem>
            )
          }
        })}
      </SidebarContent>
    </Sidebar>
  )
}
