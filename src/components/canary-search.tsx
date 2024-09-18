"use client"

import { useEffect, useState } from "react"

import { Skeleton } from "./ui/skeleton"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagefind: any
  }
}
export const CanarySearch = () => {
  const [loaded, setLoaded] = useState(false)
  const [useMockProvider, setUseMockProvider] = useState(false)

  // try to load pagefind
  // if not found, use mock provider
  useEffect(() => {
    async function loadPagefind() {
      if (typeof window.pagefind === "undefined") {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          window.pagefind = await import(
            // @ts-expect-error pagefind generated after build
            /* webpackIgnore: true */ "/pagefind/pagefind.js"
          )
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.log(
            "Unable to load pagefind. Maybe you're running the page in dev mode? Switching to the mock provider...",
          )
          setUseMockProvider(true)
        }
      }
    }
    void loadPagefind()
  }, [])

  // load the @canary/web components
  useEffect(() => {
    void Promise.all([
      import("@getcanary/web/components/canary-root.js"),
      import("@getcanary/web/components/canary-provider-pagefind.js"),
      import("@getcanary/web/components/canary-provider-mock.js"),
      import("@getcanary/web/components/canary-content.js"),
      import("@getcanary/web/components/canary-input.js"),
      import("@getcanary/web/components/canary-search.js"),
      import("@getcanary/web/components/canary-search-results.js"),
    ]).then(() => setLoaded(true))
  }, [])

  return (
    <>
      {loaded ? (
        useMockProvider ? (
          <canary-root>
            <canary-provider-mock>
              <canary-content>
                <canary-input slot="input"></canary-input>
                <canary-search slot="mode">
                  <canary-search-results slot="body"></canary-search-results>
                </canary-search>
              </canary-content>
            </canary-provider-mock>
          </canary-root>
        ) : (
          <canary-root>
            <canary-provider-pagefind>
              <canary-content>
                <canary-input slot="input"></canary-input>
                <canary-search slot="mode">
                  <canary-search-results slot="body"></canary-search-results>
                </canary-search>
              </canary-content>
            </canary-provider-pagefind>
          </canary-root>
        )
      ) : (
        <Skeleton className="h-12 w-[550px] shadow-lg" />
      )}
    </>
  )
}
