import { execa } from "execa";

import Bourne from "@hapi/bourne";

interface DocOutput {
  title: string;
  filter: string;
  annotations: string[];
  tags: string[];
  parent: string[];
  location: {
    file: string;
    line: number;
  };
}

export async function getPlaywrightTests() {
  const transform = function* (line: unknown) {
    if (!(line as string).includes("> ") && (line as string).trim() !== "\n") {
      yield `${line as string}`;
    }
  };

  const { stdout, failed } = await execa({
    reject: false,
    stdout: transform,
  })("pnpm", ["list:tests"]);

  if (failed) {
    return [];
  }

  const parsedStdout = Bourne.parse(stdout.replaceAll("\n", "")) as DocOutput[];

  return parsedStdout;
}
