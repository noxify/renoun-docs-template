/* webpackIgnore: true */
"use client"

import React from "react"
import { CanarySearch as WC } from "@getcanary/web/components/canary-search.js"
import { createComponent } from "@lit/react"

export const CanarySearch = createComponent({
  react: React,
  tagName: "canary-search",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-search": WC
  }
}
