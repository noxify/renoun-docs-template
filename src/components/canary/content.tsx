/* webpackIgnore: true */
"use client"

import React from "react"
import { CanaryContent as WC } from "@getcanary/web/components/canary-content.js"
import { createComponent } from "@lit/react"

export const CanaryContent = createComponent({
  react: React,
  tagName: "canary-content",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-content": WC
  }
}
