import createMDXPlugin from "@next/mdx"
import { rehypePlugins, remarkPlugins } from "@renoun/mdx"
import rehypeMdxImportMedia from "rehype-mdx-import-media"

const withMDX = createMDXPlugin({
  options: {
    remarkPlugins,
    rehypePlugins: [...rehypePlugins, rehypeMdxImportMedia],
  },
})

export default withMDX({
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  // experimental: {
  //   parallelServerCompiles: true,
  //   webpackBuildWorker: true,
  // },
  webpack(config, { webpack }) {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    }

    return config
  },
})
