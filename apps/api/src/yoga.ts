import { createYoga } from "graphql-yoga"

import { schema } from "./schema"
import { initContextCache } from "@pothos/core"

// Create a Yoga instance with a GraphQL schema.
export const yoga = createYoga({
  schema,
  maskedErrors: true,
  landingPage: false,
  context: () => {
    return {
      ...initContextCache(),
    }
  },
  healthCheckEndpoint: "/live",
})
