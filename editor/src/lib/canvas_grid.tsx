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
  // let previous: TokenType | null = null;

  // Make sure tokens end on EOF - log error on fire to flag needed fix
  if (tokens.length > 0 && tokens[tokens.length - 1].kind !== "Eof") {
    console.warn("Lexer error, missing EOF");
    tokens.push({ kind: "Eof", value: undefined, category: "Whitespace" });
  }

  let children: JSX.Element[] = [];
  for (const [idx, token] of tokens.entries()) {
    if (token.kind === "Dedent") continue; // todo: handle indents
    if (token.kind === "Eof") {
      grid.rows.push({
        index,
        indent,
        elements: <div key={index}>{children}</div>,
      });
    } else if (token.kind === "Newline") {
      grid.rows.push({
        index,
        indent,
        elements: <div key={index}>{children}</div>,
      });
      index += 1;
      if (idx - 1 > 0 && tokens[idx - 1].kind === "Newline") {
        grid.rows.push({
          index,
          indent,
          elements: <div>{renderElement(token, `${index}-${children.length}`)}</div>,
        });
        index += 1;
      }
      children = [];
    } else {
      if (token.kind === "Indent" || token.kind === "Dedent") {
        indent +=
          token.kind === "Indent" ? Number.parseInt(token.value!) : -Number.parseInt(token.value!);
        children.push(
          renderElement(
            { kind: "Whitespace", value: indent.toString(), category: "Whitespace" },
            `${index}-${children.length}`,
          ),
        );
        continue;
      }
      children.push(renderElement(token, `${index}-${children.length}`));
    }
  }

  return grid;
}

export { gridify, type Grid };
