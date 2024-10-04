import { tmpdir } from "os"
import path from "path"
import type {
  ClassName,
  GeneratorOptions,
  PackageName,
} from "@graphql-markdown/types"
import { generateDocFromSchema } from "@graphql-markdown/core"

async function main() {
  const config: GeneratorOptions = {
    outputDir: path.join(process.cwd(), "content/docs/graphql/rickandmorty/"),
    diffMethod: "NONE",
    force: true,
    loaders: {
      ["GraphQLFileLoader" as ClassName]:
        "@graphql-tools/graphql-file-loader" as PackageName,
    },
    skipDocDirective: [],
    onlyDocDirective: [],
    printer: "@graphql-markdown/printer-legacy" as PackageName,
    schemaLocation: path.join(
      process.cwd(),
      "src/graphql-schema/rickandmorty.graphql",
    ),
    docOptions: {
      frontMatter: {
        title: "GraphQL Rick and Morty API",
        description:
          "A GraphQL schema for the Rick and Morty API. This is a generated file.",
      },
    },
    metatags: [],
    prettify: true,

    printTypeOptions: {
      exampleSection: true,
      hierarchy: "entity",
      codeSection: true,
      relatedTypeSection: true,
    },
    linkRoot: "/docs/graphql/",

    baseURL: "/rickandmorty/",
    homepageLocation: path.join(
      process.cwd(),
      "content/docs/graphql/index.mdx",
    ),
    tmpDir: tmpdir(),
  }

  await generateDocFromSchema(config)
}

void main()
