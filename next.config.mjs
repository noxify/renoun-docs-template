import createLitWrapper from "@lit-labs/nextjs"
import createMDXPlugin from "@next/mdx"
import { rehypePlugins, remarkPlugins } from "@renoun/mdx-plugins"

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
  },
})

const withLit = createLitWrapper({ addDeclarativeShadowDomPolyfill: true })

export default withMDX({
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  webpack(config, { webpack }) {
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
    )
    return config
  },
})
