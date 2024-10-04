import path from "path"
import { cache } from "react"
import { Comments } from "@/components/comments"
import { TableOfContents } from "@/components/table-of-contents"
import { getPlaywrightTests } from "@/lib/playwright"
import { cn } from "@/lib/utils"
import { CodeBlock } from "renoun/components"

const cachedPlaywrightTests = cache(getPlaywrightTests)
export async function generateStaticParams() {
  const testcases = await cachedPlaywrightTests()

  const testTags = testcases
    .map((test) => test.tags)
    .flatMap((ele) => ele.join(":"))

  const uniqueTags = [...new Set(testTags)].map((ele) => ({
    slug: `${ele}`.split(":"),
  }))

  return uniqueTags
}

export default async function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const suites = await cachedPlaywrightTests()
  const tests = suites.filter((ele) => {
    return ele.tags.every((v) => params.slug.includes(v))
  })

  const pageTitle = tests[0].parent

  return (
    <>
      <div className="gap-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div>
          <article data-pagefind-body>
            <div
              className={cn(
                // default prose
                "prose dark:prose-invert",
                // remove backtick from inline code block
                "prose-code:before:hidden prose-code:after:hidden",
                // use full width
                "w-full max-w-full",
              )}
            >
              <h1>{pageTitle.join(" / ")}</h1>

              {tests.map((test, index) => {
                return (
                  <div key={index}>
                    <h2 id={test.title.replace(/\s/g, "-").toLowerCase()}>
                      {test.title}
                    </h2>
                    <CodeBlock
                      language="ts"
                      showLineNumbers={true}
                      filename={path.relative(
                        process.cwd(),
                        test.location.file,
                      )}
                      focusedLines={test.location.line.toString()}
                      source={test.location.file}
                    />
                  </div>
                )
              })}
            </div>
          </article>
          <div className="mt-6">
            <Comments />
          </div>
        </div>
        <div className="hidden w-[19.5rem] xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:pb-16 xl:pr-6">
          <TableOfContents
            toc={tests.map((test) => ({
              text: test.title,
              depth: 2,
              id: test.title.replace(/\s/g, "-").toLowerCase(),
            }))}
          />
        </div>
      </div>
    </>
  )
}
