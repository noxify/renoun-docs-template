"use client"

import type { TreeItem } from "@/lib/tree"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export function Navigation({
  className,
  items,
}: {
  items: TreeItem[]
} & React.ComponentProps<"ul">) {
  return (
    <ul className={cn("grid gap-0.5", className)}>
      {items.map((item) =>
        (item.children ?? []).length > 0 ? (
          <Collapsible key={item.path} asChild defaultOpen={true}>
            <li>
              <div className="relative flex items-center">
                {item.isFile ? (
                  <Link
                    href={item.path}
                    className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2"
                  >
                    <div className="flex flex-1 overflow-hidden">
                      <div className="line-clamp-1 pr-6">{item.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-1 overflow-hidden">
                    <div className="line-clamp-1 pr-6">{item.title}</div>
                  </div>
                )}

                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="absolute right-1 h-6 w-6 rounded-md p-0 ring-ring transition-all focus-visible:ring-2 data-[state=open]:rotate-90"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="px-4 py-0.5">
                <ul className="grid border-l px-2">
                  {item.children?.map((subItem) => {
                    if ((subItem.children ?? []).length > 0) {
                      return (
                        <li key={subItem.path}>
                          <Navigation items={[subItem]} />
                        </li>
                      )
                    }

                    return (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className="flex h-8 min-w-8 items-center gap-2 overflow-hidden rounded-md px-2 text-sm text-muted-foreground ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2"
                        >
                          <div className="line-clamp-1">{subItem.title}</div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </CollapsibleContent>
            </li>
          </Collapsible>
        ) : (
          <li key={item.path}>
            <div className="relative flex items-center">
              <Link
                href={item.path}
                className="flex h-8 min-w-8 flex-1 items-center gap-2 overflow-hidden rounded-md px-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2"
              >
                <div className="flex flex-1 overflow-hidden">
                  <div className="line-clamp-1 pr-6">{item.title}</div>
                </div>
              </Link>
            </div>
          </li>
        ),
      )}
    </ul>
  )
}
