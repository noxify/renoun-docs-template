import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import { printCodeField } from "../code";
import { printMetadataSection, printSection } from "../section";
import { getTypeName, isOperation } from "@graphql-markdown/graphql";

export const printOperationType = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isOperation(type)) {
    return "";
  }

  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  return printSection([options.schema!.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

export const printOperationMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isOperation(type)) {
    return "";
  }

  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args, "Arguments", options);

  return `${metadata}${response}` as MDXString;
};

export const printCodeOperation = printCodeField;
