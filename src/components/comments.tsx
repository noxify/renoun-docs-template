"use client"

import Giscus from "@giscus/react"
import { useTheme } from "next-themes"

export function Comments() {
  const { theme } = useTheme()
  return (
    <div className="mt-4">
      <Giscus
        id="comments"
        repo="noxify/renoun-docs-template"
        repoId="R_kgDOMk9HrQ"
        category="Comments"
        categoryId="DIC_kwDOMk9Hrc4CiRy7"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  )
}
