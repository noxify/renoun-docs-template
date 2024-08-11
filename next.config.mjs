import { createMdxtsPlugin } from "mdxts/next"

const withMdxts = createMdxtsPlugin({
  theme: "nord",
  gitSource: "https://github.com/noxify/mdxts-docs-template",
})

/** @type {import('next').NextConfig} */
const nextConfig = withMdxts({
  reactStrictMode: true,

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
})

export default nextConfig
