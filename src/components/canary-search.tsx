"use client"

import type { CanaryRoot } from "@getcanary/web/components/canary-root.d.ts"

/* webpackIgnore: true */
import "@getcanary/web/components/canary-root.js"
/* webpackIgnore: true */ import "@getcanary/web/components/canary-provider-mock.js"
/* webpackIgnore: true */ import "@getcanary/web/components/canary-provider-pagefind.js"
/* webpackIgnore: true */ import "@getcanary/web/components/canary-search-input.js"
/* webpackIgnore: true */ import "@getcanary/web/components/canary-search-results.js"

declare global {
  interface HTMLElementTagNameMap {
    "canary-root": CanaryRoot
  }
}

export const CanarySearch = () => {
  return (
    <>
      {/* @ts-expect-error unknown type*/}
      <canary-root>
        {/* @ts-expect-error unknown type*/}
        <canary-provider-pagefind>
          {/* @ts-expect-error unknown type*/}
          <canary-content>
            {/* @ts-expect-error unknown type*/}
            <canary-search slot="mode">
              {/* @ts-expect-error unknown type*/}
              <canary-search-input slot="input"></canary-search-input>
              {/* @ts-expect-error unknown type*/}
              <canary-search-results slot="body"></canary-search-results>
              {/* @ts-expect-error unknown type*/}
            </canary-search>
            {/* @ts-expect-error unknown type*/}
          </canary-content>
          {/* @ts-expect-error unknown type*/}
        </canary-provider-pagefind>
        {/* @ts-expect-error unknown type*/}
      </canary-root>
    </>
  )
}
