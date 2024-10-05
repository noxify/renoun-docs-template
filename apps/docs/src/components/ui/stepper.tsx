import type { PropsWithChildren } from "react"
import { Children } from "react"
import { cn } from "@/lib/utils"
import clsx from "clsx"

export function Stepper({ children }: PropsWithChildren) {
  const length = Children.count(children)

  return (
    <div className="flex flex-col">
      {Children.map(children, (child, index) => {
        return (
          <div
            className={cn(
              "relative border-l pl-9",
              clsx({
                "pb-5": index < length - 1,
              }),
            )}
          >
            <div className="font-code absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium">
              {index + 1}
            </div>
            {child}
          </div>
        )
      })}
    </div>
  )
}

export function StepperItem({
  children,
  title,
}: PropsWithChildren & { title?: string }) {
  return (
    <div className="pt-0.5">
      <h4 className="mt-0">{title}</h4>
      <div>{children}</div>
    </div>
  )
}
