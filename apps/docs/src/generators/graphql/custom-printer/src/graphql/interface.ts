import type { PrintTypeOptions } from "@graphql-markdown/types";

import { printCodeType, printObjectMetadata } from "./object";

export const printInterfaceMetadata = printObjectMetadata;

export const printCodeInterface = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  return printCodeType(type, "interface", options);
};
