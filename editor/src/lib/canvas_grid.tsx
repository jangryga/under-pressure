import { TokenType } from "lexer-rs";

interface GridRow {
  index: number;
  indent: number;
  tree: JSX.Element;
}

interface Grid {
  rows: GridRow[];
}

function gridify(tokens: TokenType[]): Grid {
  const grid: Grid = { rows: [] };
  let indent = 0;
  let index = 0;

  for (const token of tokens) {
    const row: GridRow = {
      index,
      indent,
      tree: <span />,
    };
    while (token.kind !== "Newline") {}
  }

  return grid;
}
