// Source: https://github.com/the-guild-org/docs/tree/main/packages/remark-mermaid
// Author: Dimitri POSTOLOV <dmytropostolov@gmail.com> (https://github.com/B2o5T)
// License: MIT

"use client"

import type { MermaidConfig } from "mermaid"
import type { MutableRefObject, ReactElement } from "react"
import { useEffect, useId, useRef, useState } from "react"

function useIsVisible(ref: MutableRefObject<HTMLElement>) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // disconnect after once visible to avoid re-rendering of chart when `isIntersecting` will
        // be changed to true/false
        observer.disconnect()
        setIsIntersecting(true)
      }
    })

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}

export default function MermaidWrapper({
  wrapped = false,
  chart,
}: {
  wrapped?: boolean
  chart: string
}): ReactElement {
  const id = useId()
  const [svg, setSvg] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const containerRef = useRef<HTMLDivElement>(null!)
  const isVisible = useIsVisible(containerRef)

  useEffect(() => {
    // Fix when inside element with `display: hidden` https://github.com/shuding/nextra/issues/3291
    if (!isVisible) {
      return
    }
    const htmlElement = document.documentElement
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const observer = new MutationObserver(renderChart)
    observer.observe(htmlElement, { attributes: true })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    renderChart()

    return () => {
      observer.disconnect()
    }

    // Switching themes taken from https://github.com/mermaid-js/mermaid/blob/1b40f552b20df4ab99a986dd58c9d254b3bfd7bc/packages/mermaid/src/docs/.vitepress/theme/Mermaid.vue#L53
    async function renderChart() {
      const isDarkTheme =
        htmlElement.classList.contains("dark") ||
        htmlElement.attributes.getNamedItem("data-theme")?.value === "dark"
      const mermaidConfig: MermaidConfig = {
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "inherit",
        themeCSS: "margin: 1.5rem auto 0; height: auto;",
        theme: isDarkTheme ? "dark" : "default",
      }

      const { default: mermaid } = await import("mermaid")

      try {
        mermaid.initialize(mermaidConfig)
        const { svg } = await mermaid.render(
          // strip invalid characters for `id` attribute
          id.replaceAll(":", ""),
          chart.replaceAll("\\n", "\n"),
          containerRef.current,
        )
        setSvg(svg)
      } catch (error) {
        console.error("Error while rendering mermaid", error)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- when chart code changes, we need to re-render
  }, [chart, isVisible])

  const Chart = () => (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg }} />
  )

  return wrapped ? (
    <section>
      <div>
        <div className="dot-background rounded-md border p-8 dark:border-gray-700">
          <div className="bg-background border p-4">
            <Chart />
          </div>
        </div>
      </div>
    </section>
  ) : (
    <Chart />
  )
}
