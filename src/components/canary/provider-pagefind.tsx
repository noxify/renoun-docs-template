/* webpackIgnore: true */
"use client"

import React from "react"
import { CanaryProviderPagefind as WC } from "@getcanary/web/components/canary-provider-pagefind.js"
import { createComponent } from "@lit/react"

export const CanaryProviderPagefind = createComponent({
  react: React,
  tagName: "canary-provider-pagefind",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-provider-pagefind": WC
  }
}
