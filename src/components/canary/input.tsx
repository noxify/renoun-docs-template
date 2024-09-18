/* webpackIgnore: true */
"use client"

import React from "react"
import { CanaryInput as WC } from "@getcanary/web/components/canary-input.js"
import { createComponent } from "@lit/react"

export const CanaryInput = createComponent({
  react: React,
  tagName: "canary-input",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-input": WC
  }
}
