import type { VariantProps } from "class-variance-authority"
import type { MDXComponents } from "mdx/types"
import type { ReactNode } from "react"
import { cva } from "class-variance-authority"
import { CodeBlock, CodeInline } from "omnidoc/components"

import { cn } from "./lib/utils"

const headingVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function generateHeading({
  level,
  id,
  children,
}: {
  level: number
  id?: string
  children: ReactNode
}) {
  const heading = `h${level}` as VariantProps<typeof headingVariants>["variant"]
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const headingStyling = headingVariants({ variant: heading })

  return (
    <HeadingTag className={cn(headingStyling)} id={id}>
      {children}
    </HeadingTag>
  )
}

export function useMDXComponents() {
  return {
    code: (props) => {
      return (
        <CodeInline value={props.children as string} language="typescript" />
      )
    },
    pre: (props) => {
      const { value, language } = CodeBlock.parsePreProps(props)
      return <CodeBlock allowErrors value={value} language={language} />
    },
    // h1: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 1 }),
    // h2: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 2 }),
    // h3: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 3 }),
    // h4: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 4 }),
    // h5: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 5 }),
    // h6: (props: { id?: string; children: ReactNode }) =>
    //   generateHeading({ ...props, level: 6 }),
    p: (props) => (
      <p {...props} className="mb-6 leading-7 [&:not(:first-child)]:mt-6" />
    ),
    ul: (props) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
    ),
    blockquote: (props) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
    ),
  } satisfies MDXComponents
}
