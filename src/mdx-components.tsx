import type { ComponentPropsWithoutRef, ReactNode } from "react"
import type { CodeBlockProps, CodeInlineProps } from "renoun/components"
import type { MDXComponents } from "renoun/mdx"
import Image from "next/image"
import Link from "next/link"
import {
  Accordion as BaseAccordion,
  AccordionContent as BaseAccordionContent,
  AccordionItem as BaseAccordionItem,
  AccordionTrigger as BaseAccordionTrigger,
} from "@/components/ui/accordion"
import { ExternalLinkIcon } from "lucide-react"
import { CodeBlock, CodeInline } from "renoun/components"

import { DataTableBuilder } from "./components/data-table-builder"
import MermaidWrapper from "./components/mermaid-wrapper"
import RailroadWrapper from "./components/railroad-wrapper"
import { TableBuilder } from "./components/table-builder"
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
    // links ( relative, absolute, remote, mails )
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
          <Link href={href} {...props} prefetch={true}>
            {children ?? href}
          </Link>
        </>
      )
    },
    // markdown image handler
    img: (props) => (
      <section>
        <div className="flex items-center justify-center">
          <div className="dot-background rounded-md border p-8 md:w-3/4 dark:border-gray-700">
            <div className="bg-background border p-4">
              <Image
                {...props}
                width={0}
                height={0}
                style={{ width: "100%", height: "auto" }}
                className="not-prose object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    ),
    // if you decide to use `<Image />` inside your mdx, you have the possibility to overwrite
    // the default values ( e.g. for width, height or className ) - we do this differently from the `img` tag above
    // because we think if you use `<Image />` inside your mdx, you should have this flexibility
    // if this is not what you want - feel free to change the code below or import the `Image` component directly
    Image: (props) => (
      <section>
        <div className="flex items-center justify-center">
          <div className="dot-background rounded-md border p-8 md:w-3/4 dark:border-gray-700">
            <div className="bg-background border p-4">
              <Image
                width={0}
                height={0}
                style={{ width: "100%", height: "auto" }}
                className="not-prose object-contain"
                {...props}
              />
            </div>
          </div>
        </div>
      </section>
    ),
    // Inline code
    // adding the children prop as workaround (?)
    code: (props: CodeInlineProps & { children: string }) => {
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
    // Code block
    pre: (
      props: CodeBlockProps & {
        value: string
        focusLines?: string
        highlightLines?: string
      },
    ) => {
      const {
        focusLines,
        highlightLines,
        showLineNumbers,
        filename,
        language,
        value,
      } = props

      return (
        <CodeBlock
          className={{ container: "my-4!" }}
          allowErrors
          value={value}
          language={language ?? "plaintext"}
          allowCopy
          filename={filename ?? undefined}
          showLineNumbers={showLineNumbers ?? false}
          highlightedLines={highlightLines ?? undefined}
          focusedLines={focusLines ?? undefined}
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
        <dt className="text-primary text-sm leading-6 font-medium">
          {children}
        </dt>
      )
    },

    dd: ({ children }: { children?: ReactNode }) => {
      return (
        <dd className="text-primary mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
          {children}
        </dd>
      )
    },

    DescriptionList: ({ children }: { children: ReactNode }) => {
      return (
        <dl className="divide-accent-foreground/15 divide-y">{children}</dl>
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
          <dt className="text-primary text-sm leading-6 font-bold lg:mt-0">
            {label}
          </dt>
          <dd className="text-primary mt-1 text-sm leading-6 lg:col-span-2 lg:mt-0">
            {children}
          </dd>
        </div>
      )
    },

    Railroad: ({
      content,
      wrapped,
    }: {
      content: string
      wrapped?: boolean
    }) => {
      return <RailroadWrapper content={content} wrapped={wrapped} />
    },

    Mermaid: ({ content, wrapped }: { content: string; wrapped?: boolean }) => {
      return <MermaidWrapper chart={content} wrapped={wrapped} />
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
