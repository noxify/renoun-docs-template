"use client"

import type { TreeItem } from "@/lib/utils"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebarStore } from "@/hooks/use-sidebar"
import { current } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export function Navigation({
  className,
  items,
}: {
  items: TreeItem[]
} & React.ComponentProps<"ul">) {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebarStore()

  const isMobile = useIsMobile()

  if (items.length === 0) return <></>
  return (
    <ul className={cn("grid gap-y-1", className)}>
      {items.map((item) =>
        (item.children ?? []).length > 0 ? (
          <CollapsibleItem pathname={pathname} item={item} key={item.path} />
        ) : (
          <li key={item.path}>
            <div className="relative flex items-center">
              <Link
                onClick={isMobile ? () => toggleSidebar() : undefined}
                href={item.path}
                className={cn(
                  "flex h-8 min-w-8 flex-1 items-center p-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2",
                  current({ pathname, item })
                    ? "rounded-sm bg-muted"
                    : "hover:rounded-sm hover:bg-muted",
                )}
              >
                <div className="line-clamp-1 pr-6">{item.title}</div>
              </Link>
            </div>
          </li>
        ),
      )}
    </ul>
  )
}

function CollapsibleItem({
  pathname,
  item,
}: {
  pathname: string
  item: TreeItem
}) {
  const isMobile = useIsMobile()
  const isCurrent = current({ pathname, item })
  const [open, setOpen] = useState(isCurrent)
  const { toggleSidebar } = useSidebarStore()

  useEffect(() => {
    setOpen(isCurrent)
  }, [isCurrent])

  return (
    <Collapsible key={item.path} asChild open={open} onOpenChange={setOpen}>
      <li>
        <div className="relative mb-0.5 flex items-center">
          {item.isFile ? (
            <Link
              href={item.path}
              onClick={isMobile ? () => toggleSidebar() : undefined}
              className={cn(
                "flex h-8 min-w-8 flex-1 items-center gap-2 p-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2",
                current({ pathname, item })
                  ? "rounded-sm bg-muted"
                  : "hover:rounded-sm hover:bg-muted",
              )}
            >
              {current({ pathname, item }) && item.depth > 3 && (
                <div
                  aria-hidden="true"
                  className="absolute -left-[9px] bottom-0 top-0 z-50 w-[1px] bg-foreground/30"
                ></div>
              )}
              <div className="line-clamp-1 pr-6">{item.title}</div>
            </Link>
          ) : (
            <div
              className={cn(
                "flex h-8 min-w-8 flex-1 items-center gap-2 p-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2",
                current({ pathname, item })
                  ? "rounded-sm bg-muted"
                  : "hover:rounded-sm hover:bg-muted",
              )}
            >
              {current({ pathname, item }) && (
                <div
                  aria-hidden="true"
                  className="absolute -left-[9px] bottom-0 top-0 z-50 w-[1px] bg-foreground/30"
                ></div>
              )}
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
        <CollapsibleContent className="px-2 py-0.5">
          <ul className="grid gap-y-1 border-l px-2">
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
                    onClick={isMobile ? () => toggleSidebar() : undefined}
                    className={cn(
                      "flex h-8 min-w-8 flex-1 items-center gap-2 p-1.5 text-sm text-muted-foreground outline-none ring-ring transition-all hover:text-accent-foreground focus-visible:ring-2",
                      current({ pathname, item: subItem })
                        ? "rounded-sm bg-muted"
                        : "hover:rounded-sm hover:bg-muted",
                    )}
                  >
                    {current({ pathname, item: subItem }) && (
                      <div
                        aria-hidden="true"
                        className="absolute -left-[9px] bottom-0 top-0 z-50 w-[1px] bg-foreground/30"
                      ></div>
                    )}
                    <div className="line-clamp-1">{subItem.title}</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      </li>
    </Collapsible>
  )
}
