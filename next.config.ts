import createMDXPlugin from "@next/mdx"
import { rehypePlugins, remarkPlugins } from "@renoun/mdx"

const withMDX = createMDXPlugin({
  options: {
    remarkPlugins,
    rehypePlugins,
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
  webpack(config, { webpack }) {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    }
    config.plugins.push(
      new webpack.ContextReplacementPlugin(
        /\/(@ts-morph\/common)\//,
        (data: { dependencies: any }) => {
          for (const dependency of data.dependencies) {
            delete dependency.critical
          }
          return data
        },
      ),
    )
    return config
  },
})
