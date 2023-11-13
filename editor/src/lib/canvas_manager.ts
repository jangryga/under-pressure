import { TokenType, Token, LexerWrapper } from "lexer-rs";

interface CanvasContext {
  tokens: TokenType[];
  lexer: LexerWrapper;
}

class Canvas {
  private context: CanvasContext;

  constructor() {
    this.context = { tokens: [], lexer: new LexerWrapper() };
  }

  // getCarrotPosition() {
  //   let tokerino = new Token();
  //   tokerino.into_js_value();
  // }

  updateCanvas() {
    // calculat
  }

  tokenize(text: string) {
    this.context.tokens = this.context.lexer.tokenize(text);
    return this.context.tokens;
  }
}

export { Canvas };
