import type { MDXComponents } from "mdx/types"
import { CodeBlock, CodeInline } from "omnidoc/components"

export function useMDXComponents() {
  return {
    code: (props) => {
      return (
        <CodeInline
          value={props.children as string}
          language="typescript"
          css={{
            backgroundColor: "hsl(var(--secondary))",
            color: "auto",
            boxShadow: "none",
            display: "inline",
          }}
          paddingX="auto"
          paddingY="auto"
          className="border px-2 py-0.5 text-xs"
        />
      )
    },
    pre: (props) => {
      const { value, language } = CodeBlock.parsePreProps(props)
      return <CodeBlock allowErrors value={value} language={language} />
    },
  } satisfies MDXComponents
}
