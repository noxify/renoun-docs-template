import createMDXPlugin from "@next/mdx"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"

const withMDX = createMDXPlugin({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
})

export default withMDX({
  output: "export",
  reactStrictMode: true,

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
