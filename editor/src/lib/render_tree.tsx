import { TokenType, TokenCategory } from "lexer-rs";

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
  switch (token.kind) {
    case 0:
      return <span>" "</span>;
    case 186 /** Ident */:
      return <span className={className}>{token.value}</span>;
    default:
      throw new Error(`Unknown token ${token}`);
  }
}
