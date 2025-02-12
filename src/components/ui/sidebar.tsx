"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
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
      className={cn(
        "bg-accent/50 top-20 flex min-h-screen pl-0 transition-all duration-300 ease-in-out data-[sidebar=closed]:pl-0 sm:pl-[calc(theme(width.72))]",
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
      className={cn("lg:hidden", props.className)}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { defaultHidden?: boolean }
>(({ className, children, defaultHidden }, ref) => {
  const { showSidebar, toggleSidebar } = useSidebarStore()

  const sidebar = (
    <div
      ref={ref}
      className={cn(
        "bg-background flex h-full flex-col border-r pb-12",
        className,
      )}
    >
      {children}
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={!showSidebar} onOpenChange={() => toggleSidebar()}>
          <SheetContent className="w-72 p-0 [&>button]:hidden" side="left">
            <SheetTitle className="hidden">Navigation</SheetTitle>
            {sidebar}
          </SheetContent>
        </Sheet>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-10 w-72 transition-all duration-300 ease-in-out in-data-[sidebar=closed]:left-[calc(theme(width.72)*-1)]",
          defaultHidden ? "hidden" : "hidden lg:block",
        )}
      >
        {sidebar}
      </aside>
    </>
  )
})
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
      className={cn("flex flex-1 flex-col gap-2 overflow-auto py-4", className)}
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
      className={cn("px-1.5 text-sm font-medium", className)}
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
