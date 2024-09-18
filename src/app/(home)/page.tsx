import Link from "next/link"
import { CanarySearch } from "@/components/canary-search"
import { MoveUpRightIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-[88vh] flex-col items-center justify-center px-2 py-8 text-center sm:min-h-[91vh]">
      <Link
        href="https://github.com/noxify/renoun-docs-template"
        target="_blank"
        className="mb-5 flex items-center gap-2 underline underline-offset-4 sm:text-lg"
      >
        Follow along on GitHub{" "}
        <MoveUpRightIcon className="h-4 w-4 font-extrabold" />
      </Link>
      <h1 className="mb-4 text-3xl font-bold sm:text-7xl">
        An example app to built your documentation based on renoun.
      </h1>
      <p className="mb-8 max-w-[800px] text-muted-foreground sm:text-xl">
        This feature-packed documentation template, built with Next.js, offers a
        sleek and responsive design, perfect for all your project documentation
        needs.
      </p>

      <CanarySearch />
    </div>
  )
}
