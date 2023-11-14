import { TokenType, LexerWrapper } from "lexer-rs";
import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

interface CanvasContextType {
  tokens: TokenType[];
  lexer: LexerWrapper;
  tree: ReactNode;
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
        return {
          ...state,
          tokens: state.lexer.tokenize(action.payload),
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
