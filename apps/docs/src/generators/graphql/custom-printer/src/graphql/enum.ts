import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import { hasPrintableDirective } from "../common";
import { DEPRECATED, MARKDOWN_EOL } from "../const/strings";
import { printMetadataSection } from "../section";
import {
  getTypeName,
  isDeprecated,
  isEnumType,
} from "@graphql-markdown/graphql";

export const printEnumMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isEnumType(type)) {
    return "";
  }

  return printMetadataSection(type, type.getValues(), "Values", options);
};

export const printCodeEnum = (
  type: unknown,
  options?: PrintTypeOptions,
): string => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((value): string => {
      if (!hasPrintableDirective(value, options)) {
        return "";
      }
      const v = getTypeName(value);
      const d = isDeprecated(value) ? ` @${DEPRECATED}` : "";
      return `  ${v}${d}`;
    })
    .filter((value): boolean => {
      return value.length > 0;
    })
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};
