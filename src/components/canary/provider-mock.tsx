/* webpackIgnore: true */
"use client"

import React from "react"
import { CanaryProviderMock as WC } from "@getcanary/web/components/canary-provider-mock.js"
import { createComponent } from "@lit/react"

export const CanaryProviderMock = createComponent({
  react: React,
  tagName: "canary-provider-mock",
  elementClass: WC,
})

declare global {
  interface HTMLElementTagNameMap {
    "canary-provider-mock": WC
  }
}
