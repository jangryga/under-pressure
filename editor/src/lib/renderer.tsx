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

export function renderElement(token: TokenType, key: string, CSSConfig: { useTailwind: boolean }) {
  const textColor = style[TokenCategory[token.category as any] as any];
  // @ts-ignore
  switch (TokenKind[token.kind]) {
    case 1: {
      console.error("Dedent detected");
      return <span />;
    }
    case 2 /* StringMultiline */:
      return <span key={key}>{token.value}</span>;
    case 3 /* CommentSingleline */:
      return <span key={key}>{token.value}</span>;
    case 61 /* string */:
      return <span key={key}>{token.value}</span>;
    case 187 /* Eof */:
      return <span key={key} />;
    case 188 /* Identity */:
      return (
        <span
          {...(CSSConfig.useTailwind ? { className: textColor } : { style: { color: textColor } })}
          key={key}>
          {token.value}
        </span>
      );
    case 189 /** Newline */:
      return <br />;
    case 190 /** Whitespace */:
      return <span key={key}>{"\u00A0".repeat(Number.parseInt(token.value!))}</span>;
    default:
      return (
        <span
          {...(CSSConfig.useTailwind ? { className: textColor } : { style: { color: textColor } })}
          key={key}>
          {tokenLookup(TokenKind[token.kind as any] as any)}
        </span>
      );
  }
}
