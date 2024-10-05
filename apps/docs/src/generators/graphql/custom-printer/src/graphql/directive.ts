import type {
  GraphQLDirective,
  MDXString,
  PrintDirectiveOptions,
} from "@graphql-markdown/types";

import { printCodeArguments } from "../code";
import { printMetadataSection } from "../section";
import { getTypeName } from "@graphql-markdown/graphql";

const printCodeDirectiveLocation = (type: GraphQLDirective): string => {
  if (typeof type.locations === "undefined" || type.locations.length === 0) {
    return "";
  }

  let code = ` on `;
  const separator = `\r\n  | `;
  if (type.locations.length > 1) {
    code += separator;
  }
  code += type.locations.join(separator).trim();

  return code;
};

export const printDirectiveMetadata = (
  type: GraphQLDirective,
  options: PrintDirectiveOptions,
): MDXString | string => {
  if (!("args" in type)) {
    return "";
  }

  return printMetadataSection(type, type.args, "Arguments", options);
};

export const printCodeDirective = (
  type: GraphQLDirective,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: PrintDirectiveOptions,
): string => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};
