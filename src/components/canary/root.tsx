/* webpackIgnore: true */
"use client"

import React from "react"
import { CanaryRoot as WC } from "@getcanary/web/components/canary-root.js"
import { createComponent } from "@lit/react"

export const CanaryRoot = createComponent({
  react: React,
  tagName: "canary-root",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-root": WC
  }
}
