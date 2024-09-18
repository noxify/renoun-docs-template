/* webpackIgnore: true */
"use client"

import React from "react"
import { CanarySearchResults as WC } from "@getcanary/web/components/canary-search-results.js"
import { createComponent } from "@lit/react"

export const CanarySearchResults = createComponent({
  react: React,
  tagName: "canary-search-results",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-search-results": WC
  }
}
