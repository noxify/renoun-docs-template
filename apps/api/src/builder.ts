import { DateResolver, DateTimeResolver } from "graphql-scalars"

import type { PageCursors } from "./types"
import SchemaBuilder from "@pothos/core"
import DirectivePlugin from "@pothos/plugin-directives"
import RelayPlugin from "@pothos/plugin-relay"

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
    DateTime: {
      Input: Date
      Output: Date
    }
  }
  Connection: {
    pageCursors: PageCursors
  }
  Directives: {
    example: {
      locations:
        | "OBJECT"
        | "INPUT_OBJECT"
        | "INTERFACE"
        | "FIELD_DEFINITION"
        | "ARGUMENT_DEFINITION"
        | "SCALAR"
      args: { value: string }
    }
    docs: {
      locations: "OBJECT" | "FIELD_DEFINITION"
      args: { category: string }
    }
  }
}>({
  plugins: [DirectivePlugin, RelayPlugin],
  relay: {},
  directives: { useGraphQLToolsUnorderedDirectives: true },
})

builder.addScalarType("Date", DateResolver, {
  directives: { example: { value: "2007-12-03" } },
})
builder.addScalarType("DateTime", DateTimeResolver, {
  directives: { example: { value: "2007-12-03T10:15:30Z" } },
})
