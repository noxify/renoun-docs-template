"use client";

import { useTheme } from "next-themes";

import Giscus from "@giscus/react";

export function Comments() {
  const { theme } = useTheme();
  return (
    <Giscus
      id="comments"
      repo="noxify/renoun-docs-template"
      repoId="R_kgDOMk9HrQ"
      category="Comments"
      categoryId="DIC_kwDOMk9Hrc4CiRy7"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === "dark" ? "dark" : "light"}
      lang="en"
      loading="lazy"
    />
  );
}
