import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"
import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert"
import { Stepper, StepperItem } from "@acme/ui/stepper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@acme/ui/tabs"

import { CodeBlock, CodeInline } from "renoun/components"

export function useMDXComponents() {
  return {
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      if (!href) {
        throw new Error(
          "You must provide a `href` attribute to create a valid link",
        )
      }

      if (
        href.startsWith("http") ||
        href.startsWith("https") ||
        href.startsWith("mailto")
      ) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
            <ExternalLinkIcon className="ml-1 inline h-4 w-4" />
          </a>
        )
      }
      return <Link href={href}>{children ?? href}</Link>
    },
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

      let allowErrors = false

      if (language === "typescript") {
        allowErrors = true
      }
      return (
        <CodeBlock
          allowErrors={allowErrors}
          value={value}
          language={language}
        />
      )
    },
    Note: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"default"}>
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Warning: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"destructive"}>
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Stepper: ({ children }: { children: ReactNode }) => {
      return <Stepper>{children}</Stepper>
    },
    StepperItem: ({
      title,
      children,
    }: {
      title?: string
      children: ReactNode
    }) => {
      return <StepperItem title={title}>{children}</StepperItem>
    },
    Tabs: Tabs,
    TabsTrigger: TabsTrigger,
    TabsList: TabsList,
    TabsContent: TabsContent,
  } satisfies MDXComponents
}
