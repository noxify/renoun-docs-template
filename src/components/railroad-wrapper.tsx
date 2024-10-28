/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import React from "react"
// @ts-expect-error no type definitions
import rr, * as rrClass from "railroad-diagrams"

import { useClientOnly } from "./client-only"

export default function RailroadWrapper({ content }: { content: string }) {
  const hasMounted = useClientOnly()

  if (!hasMounted) {
    return null
  }

  try {
    Object.assign(window, rr)
    const rrOptions = rrClass.Options
    // @ts-expect-error unknown window props
    window.rrOptions = rrOptions

    const result = eval(content).format() as string
    return <div dangerouslySetInnerHTML={{ __html: result.toString() }} />
  } catch (e) {
    console.error(e)
    return <>Unable to render railroad diagram</>
  }
}