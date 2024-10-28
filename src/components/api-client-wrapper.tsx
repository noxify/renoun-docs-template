"use client"

import type { ReferenceProps } from "@scalar/api-reference-react"
import React from "react"
import { ApiReferenceReact } from "@scalar/api-reference-react"
import { useTheme } from "next-themes"

import "@scalar/api-reference-react/style.css"

import { ClientOnly } from "./client-only"

export const ApiClientWrapper = ({
  options,
}: {
  options: Omit<
    Required<ReferenceProps>["configuration"],
    "darkMode" | "hideDarkModeToggle" | "forceDarkModeState"
  >
}) => {
  const { systemTheme, theme } = useTheme()
  return (
    <ClientOnly>
      <ApiReferenceReact
        configuration={{
          darkMode:
            (theme === "system" && systemTheme === "dark") || theme === "dark"
              ? true
              : false,
          theme: "none",
          hideDarkModeToggle: true,
          hideSearch: true,
          hideTestRequestButton: true,
          ...options,
          isEditable: false,
          hiddenClients: true,
          // customCss: `
          //   * {
          //     --scalar-background-1: var(--background);
          //   }
          //   .show-more {
          //     background-color: #ffcc00;
          //   }
          // `,
        }}
      />
    </ClientOnly>
  )
}
