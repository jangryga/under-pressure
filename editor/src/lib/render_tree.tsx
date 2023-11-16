import { TokenType, TokenCategory, TokenKind } from "lexer-rs";
import { tokenLookup } from "./token_table";

const style = [
  "text-red",
  "text-black",
  "text-black",
  "text-green",
  "text-yellow",
  "text-blue",
  "text-orange",
  "text-magenta",
  "text-red-200",
  "text-black",
  "text-black",
];

export function renderElement(token: TokenType) {
  const className = style[token.category];
  switch (TokenKind[token.kind] as any) {
    case 1: {
      console.error("Dedent detected");
      return <span />;
    }
    case 185:
      return <span />;
    case 186:
      return <span className={className}>{token.value}</span>;
    case 187:
      return <br />;
    default:
      console.log("returning default element: ");
      return <span className={className}>{tokenLookup(TokenKind[token.kind] as any)}</span>;
  }
}
