import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { BaseCodeBlockProps, MDXComponents } from "renoun/components"
import Link from "next/link"
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/components/ui/accordion"
import { ExternalLinkIcon } from "lucide-react"
import { CodeBlock, CodeInline } from "renoun/components"

import DataTableBuilder from "./components/data-table-builder"
import MermaidWrapper from "./components/mermaid-wrapper"
import RailroadWrapper from "./components/railroad-wrapper"
import TableBuilder from "./components/table-builder"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { Stepper, StepperItem } from "./components/ui/stepper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { createSlug } from "./lib/utils"

type AnchorProps = ComponentPropsWithoutRef<"a">

export function useMDXComponents() {
  return {
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
          value={props.children}
          //language={props.language}
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
    pre: (
      props: BaseCodeBlockProps & {
        value: string
        focusLines?: string
        highlightLines?: string
      },
    ) => {
      const { focusLines, highlightLines, showLineNumbers, filename } = props

      const { value, language } = CodeBlock.parsePreProps(props)

      return (
        <CodeBlock
          className={{ container: "!my-4" }}
          allowErrors
          value={value}
          language={language}
          allowCopy
          filename={filename ? filename : undefined}
          showLineNumbers={showLineNumbers ?? false}
          highlightedLines={highlightLines ? highlightLines : undefined}
          focusedLines={focusLines ? focusLines : undefined}
          showToolbar={filename ? true : false}
        />
      )
    },
    Note: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"default"} className="my-4">
          {title && <AlertTitle>{title}</AlertTitle>}
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      )
    },
    Warning: ({ title, children }: { title?: string; children: ReactNode }) => {
      return (
        <Alert variant={"destructive"} className="my-4">
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

    table: ({ children }: { children?: ReactNode }) => {
      return (
        <div className="my-4 rounded-md border bg-white dark:border-gray-700 dark:bg-transparent">
          <div className="w-full overflow-auto">
            <Table>{children}</Table>
          </div>
        </div>
      )
    },

    thead: ({ children }: { children?: ReactNode }) => {
      return <TableHeader>{children}</TableHeader>
    },
    tbody: ({ children }: { children?: ReactNode }) => {
      return <TableBody>{children}</TableBody>
    },

    th: ({ children }: { children?: ReactNode }) => {
      return <TableHead>{children}</TableHead>
    },

    tr: ({ children }: { children?: ReactNode }) => {
      return <TableRow>{children}</TableRow>
    },

    td: ({ children }: { children?: ReactNode }) => {
      return <TableCell>{children}</TableCell>
    },

    dl: ({ children }: { children?: ReactNode }) => {
      return (
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            {children}
          </div>
        </dl>
      )
    },

    dt: ({ children }: { children?: ReactNode }) => {
      return (
        <dt className="text-sm font-medium leading-6 text-primary">
          {children}
        </dt>
      )
    },

    dd: ({ children }: { children?: ReactNode }) => {
      return (
        <dd className="mt-1 text-sm leading-6 text-primary sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      )
    },

    DescriptionList: ({ children }: { children: ReactNode }) => {
      return (
        <dl className="divide-y divide-accent-foreground/15">{children}</dl>
      )
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
          <dt className="text-sm font-bold leading-6 text-primary lg:mt-0">
            {label}
          </dt>
          <dd className="mt-1 text-sm leading-6 text-primary lg:col-span-2 lg:mt-0">
            {children}
          </dd>
        </div>
      )
    },

    Railroad: ({ content }: { content: string }) => {
      return <RailroadWrapper content={content} />
    },

    Mermaid: ({ content }: { content: string }) => {
      return <MermaidWrapper chart={content} />
    },

    Accordion: ({
      children,
      collapsible,
      orientation,
      type = "single",
    }: {
      children: ReactNode
      collapsible?: boolean
      orientation?: "horizontal" | "vertical"
      type?: "single" | "multiple"
    }) => {
      return (
        <BaseAccordion
          type={type}
          collapsible={collapsible}
          orientation={orientation}
        >
          {children}
        </BaseAccordion>
      )
    },
    AccordionItem: ({
      children,
      title,
    }: {
      children: ReactNode
      title: string
    }) => {
      return (
        <BaseAccordionItem value={createSlug(title)}>
          <BaseAccordionTrigger>{title}</BaseAccordionTrigger>
          <BaseAccordionContent>{children}</BaseAccordionContent>
        </BaseAccordionItem>
      )
    },

    TableBuilder: ({
      columns,
      data,
    }: React.ComponentProps<typeof TableBuilder>) => {
      return <TableBuilder columns={columns} data={data} />
    },

    DataTableBuilder: ({
      columns,
      data,
    }: React.ComponentProps<typeof DataTableBuilder>) => {
      return <DataTableBuilder columns={columns} data={data} />
    },
  } satisfies MDXComponents
}
