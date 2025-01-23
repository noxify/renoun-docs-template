"use client"

import type { TreeItem } from "@/lib/navigation"
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
import { current } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export function Navigation({
  className,
  items,
  highlightActive = true,
}: {
  items: TreeItem[]
  highlightActive?: boolean
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
                prefetch={true}
                onClick={isMobile ? () => toggleSidebar() : undefined}
                href={item.path}
                className={cn(
                  "text-muted-foreground ring-ring hover:text-accent-foreground flex h-8 min-w-8 flex-1 items-center p-1.5 text-sm outline-hidden transition-all focus-visible:ring-2",
                  highlightActive && current({ pathname, item })
                    ? "bg-muted rounded-sm"
                    : "hover:bg-muted hover:rounded-sm",
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
      <li className="relative">
        <div className="relative mb-0.5 flex items-center">
          <Link
            prefetch={true}
            href={item.path}
            onClick={isMobile ? () => toggleSidebar() : undefined}
            className={cn(
              "text-muted-foreground ring-ring hover:text-accent-foreground flex h-8 min-w-8 flex-1 items-center gap-2 p-1.5 text-sm outline-hidden transition-all focus-visible:ring-2",
              current({ pathname, item })
                ? "bg-muted text-accent-foreground/80 rounded-sm"
                : "hover:bg-muted hover:rounded-sm",
            )}
          >
            {current({ pathname, item }) && item.depth > 3 && (
              <div
                aria-hidden="true"
                className="bg-foreground/90 absolute top-0 bottom-0 -left-[9px] z-50 w-[1px]"
              ></div>
            )}
            <div className="line-clamp-1 pr-6">{item.title}</div>
          </Link>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="ring-ring absolute right-1 h-6 w-6 rounded-md p-0 transition-all focus-visible:ring-2 data-[state=open]:rotate-90"
            >
              <ChevronRight className="text-muted-foreground h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="py-0.5 pl-2">
          <ul className="border-accent grid gap-y-1 border-l pl-2">
            {item.children?.map((subItem) => {
              if ((subItem.children ?? []).length > 0) {
                return (
                  <li key={subItem.path}>
                    <Navigation items={[subItem]} />
                  </li>
                )
              }

              return (
                <li key={subItem.path} className="relative">
                  <Link
                    prefetch={true}
                    href={subItem.path}
                    onClick={isMobile ? () => toggleSidebar() : undefined}
                    className={cn(
                      "text-muted-foreground ring-ring hover:text-accent-foreground flex h-8 min-w-8 flex-1 items-center gap-2 p-1.5 text-sm outline-hidden transition-all focus-visible:ring-2",
                      current({ pathname, item: subItem })
                        ? "text-accent-foreground hover:bg-muted hover:rounded-sm"
                        : "hover:bg-muted hover:rounded-sm",
                    )}
                  >
                    {current({ pathname, item: subItem }) && (
                      <div
                        aria-hidden="true"
                        className="bg-accent-foreground/70 absolute top-0 bottom-0 -left-[9px] z-50 w-[1px]"
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
