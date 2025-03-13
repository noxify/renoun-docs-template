import type { ReactNode } from "react"
import reactElementToJSXString from "react-element-to-jsx-string"
import { CodeBlock } from "renoun/components"

export function Preview({ children }: { children: ReactNode }) {
  return (
    <section>
      <div>
        <div className="dot-background rounded-md rounded-b-none border border-b-0 p-8 dark:border-gray-700">
          <div className="bg-background border p-4">{children}</div>
        </div>
        <CodeBlock
          className={{ container: "mx-[1px]! rounded-t-none!" }}
          allowErrors
          showLineNumbers
          allowCopy
          showToolbar={false}
          language="tsx"
        >
          {reactElementToJSXString(children)}
        </CodeBlock>
      </div>
    </section>
  )
}
