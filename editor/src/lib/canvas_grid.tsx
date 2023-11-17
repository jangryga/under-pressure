import { TokenType } from "lexer-rs";
import { renderElement } from "./renderer";

interface GridRow {
  index: number;
  indent: number;
  elements: JSX.Element;
}

interface Grid {
  rows: GridRow[];
}

function gridify(tokens: TokenType[]): Grid {
  const grid: Grid = { rows: [] };
  let indent = 0;
  let index = 0;

  // Make sure tokens end on EOF - log error on fire to flag needed fix
  if (tokens.length > 0 && tokens[tokens.length - 1].kind !== "Eof") {
    console.warn("Lexer error, missing EOF");
    tokens.push({ kind: "Eof", value: undefined, category: "Whitespace" });
  }

  let children: JSX.Element[] = [];
  for (const token of tokens) {
    if (token.kind === "Dedent") continue; // todo: handle indents
    if (token.kind === "Newline" || token.kind === "Eof") {
      grid.rows.push({
        index,
        indent,
        elements: <div>{children}</div>,
      });
      index += 1;
      grid.rows.push({
        index,
        indent,
        elements: <div>{renderElement(token)}</div>,
      });
      index += 1;
      children = [];
    } else {
      children.push(renderElement(token));
    }
  }

  console.log("grid: ", grid);

  return grid;
}

export { gridify, type Grid };
