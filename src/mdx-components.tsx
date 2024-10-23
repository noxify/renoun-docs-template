import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"
import { CodeBlock, CodeInline } from "renoun/components"

import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { Stepper, StepperItem } from "./components/ui/stepper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

type AnchorProps = ComponentPropsWithoutRef<"a">

export function useMDXComponents() {
  return {
    // @ts-expect-error seems to be an type error
    //                  based on what I can see, it seems a 3rd party package
    //                  uses react18 types
    a: ({ href, children, ...props }: AnchorProps) => {
      if (!href) {
        console.log("Invalid link detected")
        return <Link href="/">###INVALID_LINK###</Link>
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

      if (href.startsWith("#")) {
        return (
          <a href={href} {...props}>
            {children}
          </a>
        )
      }

      return (
        <>
          <Link href={href} {...props}>
            {children ?? href}
          </Link>
        </>
      )
    },
    code: (props) => {
      return (
        <CodeInline
          value={props.children as string}
          language="typescript"
          allowErrors
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
    Tabs: ({
      defaultValue,
      children,
    }: {
      defaultValue?: string
      children: ReactNode
    }) => <Tabs defaultValue={defaultValue}>{children}</Tabs>,
    TabsTrigger: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsTrigger value={value}>{children}</TabsTrigger>,
    TabsList: ({ children }: { children: ReactNode }) => (
      <TabsList>{children}</TabsList>
    ),
    TabsContent: ({
      value,
      children,
    }: {
      value: string
      children: ReactNode
    }) => <TabsContent value={value}>{children}</TabsContent>,

    // @ts-expect-error type error based on react 19?
    table: ({ children }: { children?: ReactNode }) => {
      return (
        <div className="my-4 rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
          <div className="w-full overflow-auto">
            <table className="no-prose w-full caption-bottom text-sm">
              {children}
            </table>
          </div>
        </div>
      )
    },
    // @ts-expect-error type error based on react 19?
    thead: ({ children }: { children?: ReactNode }) => {
      return (
        <thead className="dark:border-gray-700 [&_tr]:border-b">
          {children}
        </thead>
      )
    },
    // @ts-expect-error type error based on react 19?
    th: ({ children }: { children?: ReactNode }) => {
      return (
        <th className="h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0">
          {children}
        </th>
      )
    },

    // @ts-expect-error type error based on react 19?
    tr: ({ children }: { children?: ReactNode }) => {
      return (
        <tr className="border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:border-gray-700 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800">
          {children}
        </tr>
      )
    },

    // @ts-expect-error type error based on react 19?
    td: ({ children }: { children?: ReactNode }) => {
      return (
        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
          {children}
        </td>
      )
    },

    // @ts-expect-error type error based on react 19?
    dl: ({ children }: { children?: ReactNode }) => {
      return (
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {children}
          </div>
        </dl>
      )
    },

    // @ts-expect-error type error based on react 19?
    dt: ({ children }: { children?: ReactNode }) => {
      return (
        <dt className="text-sm font-medium leading-6 text-primary">
          {children}
        </dt>
      )
    },
    // @ts-expect-error type error based on react 19?
    dd: ({ children }: { children?: ReactNode }) => {
      return (
        <dd className="mt-1 text-sm leading-6 text-primary sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      )
    },
    DescriptionList: ({ children }: { children: ReactNode }) => {
      return <dl className="divide-y divide-gray-200">{children}</dl>
    },
    DescriptionListItem: ({
      label,
      children,
    }: {
      label: string
      children: ReactNode
    }) => {
      return (
        <div className="px-0 py-6 lg:grid lg:grid-cols-3 lg:gap-4">
          <dt className="text-sm font-bold leading-6 text-primary">{label}</dt>
          <dd className="mt-1 text-sm leading-6 text-primary lg:col-span-2 lg:mt-0">
            {children}
          </dd>
        </div>
      )
    },
  } satisfies MDXComponents
}
