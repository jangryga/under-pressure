import { TokenType, TokenCategory, TokenKind } from "lexer-rs";
import { tokenLookup } from "./token_table";

const style = [
  "text-red-900",
  "text-gray-500",
  "text-black",
  "text-green-400",
  "text-yellow-600",
  "text-blue-700",
  "text-orang800",
  "text-magenta-500",
  "text-red-200",
  "text-black",
  "text-black",
];

export function renderElement(token: TokenType) {
  const className = style[TokenCategory[token.category as any] as any];
  // @ts-ignore
  switch (TokenKind[token.kind]) {
    case 1: {
      console.error("Dedent detected");
      return <span />;
    }
    case 185:
      return <span />;
    case 186:
      return <span className={className}>{token.value}</span>;
    case 187 /** newline */:
      return <br />;
    case 188 /** whitespace */:
      return <span>{"\u00A0".repeat(Number.parseInt(token.value!))}</span>;
    default:
      // @ts-ignore
      return <span className={className}>{tokenLookup(TokenKind[token.kind])}</span>;
  }
}
