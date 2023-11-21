import { TokenType, LexerWrapper } from "lexer-rs";
import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { Grid, gridify } from "./canvas_grid";

interface CanvasContextType {
  tokens: TokenType[];
  lexer: LexerWrapper;
  grid: Grid;
}
type CanvasActionType = { type: "SET"; payload: string };
type UseCanvasManagerResult = ReturnType<typeof useCanvasManager>;

const CanvasContext = createContext<UseCanvasManagerResult>({
  context: null as any,
  updateTree: (_: string) => {},
});

function useCanvasManager(initialCanvasContext: CanvasContextType): {
  context: CanvasContextType;
  updateTree: (text: string) => void;
} {
  const [context, dispatch] = useReducer((state: CanvasContextType, action: CanvasActionType) => {
    switch (action.type) {
      case "SET": {
        console.log(
          "in: ",
          Array.from(action.payload).map((e) => e.charCodeAt(0)),
        );
        const tokens = state.lexer.tokenize(action.payload);
        console.log("out: ", tokens);
        // const tree = tokens.map((t: TokenType) => renderElement(t));
        const grid = gridify(tokens);
        return {
          ...state,
          tokens,
          grid,
        };
      }
      default:
        throw new Error("unimplemented");
    }
  }, initialCanvasContext);

  const updateTree = useCallback((text: string) => {
    dispatch({ type: "SET", payload: text });
  }, []);

  return { context, updateTree };
}

export const CanvasProvider = ({
  initialContext,
  children,
}: {
  initialContext: CanvasContextType;
  children: ReactNode;
}) => (
  <CanvasContext.Provider value={useCanvasManager(initialContext)}>
    {children}
  </CanvasContext.Provider>
);

export const useUpdateContext = (): UseCanvasManagerResult["updateTree"] => {
  const { updateTree } = useContext(CanvasContext);
  return updateTree;
};

export const useCanvasContext = (): UseCanvasManagerResult["context"] => {
  const { context } = useContext(CanvasContext);
  return context;
};
