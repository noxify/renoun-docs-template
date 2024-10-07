import type { AddressInfo } from "net"
import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { createMiddleware } from "hono/factory"


import { env } from "./env"
import { yoga } from "./yoga"



export const withYoga = createMiddleware(async (c) => {
  const response = await yoga.fetch(
    c.req.url,
    {
      method: c.req.method,
      headers: c.req.header(),
      body: c.req.raw.body,
    },
    c,
  )

  const headersObj = Object.fromEntries(response.headers.entries())

  return c.body(response.body, {
    status: response.status,
    headers: headersObj,
  })
})

const app = new Hono()



// graphql definitions

app.use("/graphql", withYoga)

const generateUrl = (path: string, info: AddressInfo) =>
  new URL(path, `http://localhost:${info.port}`).toString()

serve(
  {
    fetch: app.fetch,
    port:  env.BACKEND_PORT,
  },
  (info) => {
    console.info(`
  * Server URL: ${generateUrl("/", info)}
  * GraphQL Endpoint: ${generateUrl(yoga.graphqlEndpoint, info)}
  `
)}
)