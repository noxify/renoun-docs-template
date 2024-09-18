"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"

//import { CanarySearch } from "./canary-search"
//import { CanaryContent } from "./canary/content"
//import { CanaryInput } from "./canary/input"
//import { CanaryProviderMock } from "./canary/provider-mock"
//import { CanaryRoot } from "./canary/root"
//import { CanarySearchResults } from "./canary/search-results"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pagefind: any
  }
}
export const CanarySearchReact = () => {
  //const [loaded, setLoaded] = useState(false)

  const CanaryContent = dynamic(() =>
    import("./canary/content").then((mod) => mod.CanaryContent),
  )
  const CanaryInput = dynamic(() =>
    import("./canary/input").then((mod) => mod.CanaryInput),
  )
  const CanarySearch = dynamic(() =>
    import("./canary/search").then((mod) => mod.CanarySearch),
  )
  const CanaryProviderMock = dynamic(() =>
    import("./canary/provider-mock").then((mod) => mod.CanaryProviderMock),
  )
  const CanaryRoot = dynamic(() =>
    import("./canary/root").then((mod) => mod.CanaryRoot),
  )
  const CanarySearchResults = dynamic(() =>
    import("./canary/search-results").then((mod) => mod.CanarySearchResults),
  )

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
        }
      }
    }
    void loadPagefind()
  }, [])

  return (
    <>
      <CanaryRoot>
        <CanaryProviderMock>
          <CanaryContent>
            <CanaryInput slot="input" />
            <CanarySearch slot="mode">
              <CanarySearchResults slot="body" />
            </CanarySearch>
          </CanaryContent>
        </CanaryProviderMock>
      </CanaryRoot>
    </>
  )
}
