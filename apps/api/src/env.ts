/* eslint-disable no-restricted-properties */
import { createEnv } from "@t3-oss/env-core"
import dotenv from "dotenv"
import { z } from "zod"

dotenv.config({
  path: "../../.env",
})

export const env = createEnv({
  server: {
    
    BACKEND_PORT: z.coerce.number().default(4000),
   
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.npm_lifecycle_event === "test",
})
