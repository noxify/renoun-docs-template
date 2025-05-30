"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronsUpDown, SquareChartGanttIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export interface TableOfContents {
  text: string
  id: string
  level: number
}

interface TocProps {
  toc: TableOfContents[]
}

export function TableOfContents({ toc }: TocProps) {
  const itemIds = toc.map((item) => item.id)
  const activeHeading = useActiveItem(itemIds)

  if (toc.length === 0) {
    return null
  }

  const filteredToc = toc.filter((item) => item.level > 1 && item.level < 4)

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className={cn("m-0 list-none")}>
        {filteredToc.map((item, index) => {
          return (
            <li key={index} className={cn("mt-0 pt-2")}>
              <a
                href={`#${item.id}`}
                className={cn(
                  item.level == 2 ? "pl-0" : "",
                  item.level == 3 ? "pl-4" : "",

                  "hover:text-foreground inline-block no-underline transition-colors",
                  item.id === `${activeHeading}`
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function MobileTableOfContents({ toc }: TocProps) {
  const itemIds = toc.map((item) => item.id)
  const activeHeading = useActiveItem(itemIds)

  const filteredToc = toc.filter((item) => item.level > 1 && item.level <= 4)

  return (
    <div className="bg-background fixed top-12 left-0 z-20 h-[calc(theme(height.12)+1px)] w-full border-b px-2 py-2.5 lg:left-[theme(width.72)] lg:w-[calc(theme(width.full)-theme(width.72))] xl:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="ring-ring hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent w-full rounded-md focus-visible:ring-2 focus-visible:outline-hidden">
          <div className="flex items-center gap-1.5 overflow-hidden px-2 py-1.5 text-left text-sm transition-all">
            <SquareChartGanttIcon className="text-muted-foreground/50 ml-auto h-4 w-4" />
            <div className="line-clamp-1 flex-1 pr-2 font-medium">
              {filteredToc.find((item) => item.id === activeHeading)?.text ??
                "Table of contents"}
            </div>
            <ChevronsUpDown className="text-muted-foreground/50 ml-auto h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-w-auto w-full min-w-full"
          align="start"
          side="bottom"
          sideOffset={4}
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          <DropdownMenuLabel>Table of contents</DropdownMenuLabel>
          {filteredToc.map((tocItem, index) => (
            <DropdownMenuItem
              key={index}
              className="items-start justify-between gap-2 px-1.5"
              asChild
            >
              <a
                href={`#${tocItem.id}`}
                className={cn(
                  "cursor-pointer",
                  tocItem.level == 2 ? "pl-2" : "",
                  tocItem.level == 3 ? "pl-4" : "",
                  tocItem.level == 4 ? "pl-6" : "",
                )}
              >
                {tocItem.text}
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    tocItem.id === `${activeHeading}`
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` },
    )

    itemIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}
