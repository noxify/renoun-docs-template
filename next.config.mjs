import createMDXPlugin from "@next/mdx"
import webpack from "webpack"

const withMdxts = createMDXPlugin({
  theme: "nord",
  gitSource: "https://github.com/noxify/mdxts-docs-template",
})

/** @type {import('next').NextConfig} */
const nextConfig = withMdxts({
  reactStrictMode: true,

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  webpack(config) {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /\/(@ts-morph\/common)\//,
        (data) => {
          for (const dependency of data.dependencies) {
            delete dependency.critical
          }
          return data
        },
      ),
      new webpack.IgnorePlugin({
        resourceRegExp: /^perf_hooks$/,
      }),
    )
    return config
  },
})

export default nextConfig
