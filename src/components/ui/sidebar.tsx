"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebarStore } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"
import { PanelLeft } from "lucide-react"

const SidebarLayout = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { showSidebar } = useSidebarStore()
  const isMobile = useIsMobile()

  const state = showSidebar && !isMobile ? "open" : "closed"

  return (
    <div
      ref={ref}
      data-sidebar={state}
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
      className={cn(
        "top-20 flex min-h-screen bg-accent/50 pl-0 transition-all duration-300 ease-in-out data-[sidebar=closed]:pl-0 sm:pl-[--sidebar-width]",
        className,
      )}
      {...props}
    />
  )
})
SidebarLayout.displayName = "SidebarLayout"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ ...props }, ref) => {
  const { toggleSidebar } = useSidebarStore()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={() => toggleSidebar()}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children }, ref) => {
    const isMobile = useIsMobile()
    const { showSidebar, toggleSidebar } = useSidebarStore()

    const sidebar = (
      <div
        ref={ref}
        className={cn("flex h-full flex-col border-r bg-background", className)}
      >
        {children}
      </div>
    )

    if (isMobile) {
      return (
        <Sheet open={!showSidebar} onOpenChange={() => toggleSidebar()}>
          <SheetContent
            className="w-[--sidebar-width] p-0 [&>button]:hidden"
            side="left"
          >
            {sidebar}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <aside className="fixed inset-y-0 left-0 z-10 w-[--sidebar-width] transition-all duration-300 ease-in-out md:block [[data-sidebar=closed]_&]:left-[calc(var(--sidebar-width)*-1)]">
        {sidebar}
      </aside>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-b px-2.5 py-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-t px-2.5 py-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-1 flex-col gap-5 overflow-auto py-4", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2 px-2.5", className)} {...props} />
  )
})
SidebarItem.displayName = "SidebarItem"

const SidebarLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "px-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
})
SidebarLabel.displayName = "SidebarLabel"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarTrigger,
  SidebarLayout,
}