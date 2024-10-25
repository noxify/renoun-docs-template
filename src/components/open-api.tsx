import OpenAPIParser from "@apidevtools/swagger-parser"

import { ApiClientWrapper } from "./api-client-wrapper"

export async function parseOpenApiDocument(path: string) {
  return await new OpenAPIParser().parse(path)
}

export async function OpenApiRenderer({ path }: { path: string }) {
  const parsedContent = await parseOpenApiDocument(path)

  return (
    <ApiClientWrapper
      options={{
        spec: {
          content: parsedContent,
        },
      }}
    />
  )
}
