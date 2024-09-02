"use client"

import type { TreeItem } from "@/lib/tree"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar"

export function SiteSidebar({ items }: { items: TreeItem[] }) {
  return (
    <Sidebar>
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
