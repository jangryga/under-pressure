import { TokenType, LexerWrapper } from "lexer-rs";
import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { Grid, gridify } from "./canvas_grid";

// old
export interface BasicSelection {
  start: number;
  end: number;
  collapsed: boolean;
  reversed?: boolean;
}

export function saveSelectionInternal(containerEl: HTMLDivElement): BasicSelection | null {
  const selection = window.getSelection();
  if (!selection) {
    return null;
  }
  const range = selection.getRangeAt(0);
  const collapsed = selection.isCollapsed;

  const prevRange = new Range();
  prevRange.selectNodeContents(containerEl);
  prevRange.setEnd(range!.startContainer, range!.startOffset);
  const start = prevRange!.toString().length;
  if (collapsed) {
    return {
      start,
      end: start,
      collapsed,
      reversed: false,
    };
  } else {
    console.warn("unstable non-collapsed range, might be incorrect");
  }

  return { start: start, end: start + range!.toString().length, collapsed };
}
interface CanvasContextType {
  tokens: TokenType[];
  lexer: LexerWrapper;
  grid: Grid;
  selection: BasicSelection | null;
}
type CanvasActionType =
  | { type: "SET"; payload: string }
  | { type: "SAVE_SELECTION"; payload: { element: HTMLDivElement } };
type UseCanvasManagerResult = ReturnType<typeof useCanvasManager>;

const CanvasContext = createContext<UseCanvasManagerResult>({
  context: null as any,
  updateTree: (_: string) => {},
  saveSelection: () => {},
});

function useCanvasManager(initialCanvasContext: CanvasContextType): {
  context: CanvasContextType;
  updateTree: (text: string) => void;
  saveSelection: (element: HTMLDivElement) => void;
} {
  const [context, dispatch] = useReducer((state: CanvasContextType, action: CanvasActionType) => {
    switch (action.type) {
      case "SAVE_SELECTION": {
        const whitespaces = state.tokens.filter((t) => t.kind === "Newline").length;
        const oldSelection = saveSelectionInternal(action.payload.element);
        return {
          ...state,
          selection: oldSelection,
        };
      }
      case "SET": {
        const tokens = state.lexer.tokenize(action.payload);
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

  const saveSelection = useCallback((element: HTMLDivElement) => {
    dispatch({ type: "SAVE_SELECTION", payload: { element } });
  }, []);

  return { context, updateTree, saveSelection };
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

export const useUpdateUpdateEditorState = (): UseCanvasManagerResult["updateTree"] => {
  const { updateTree } = useContext(CanvasContext);
  return updateTree;
};

export const useSaveEditorSelection = (): UseCanvasManagerResult["saveSelection"] => {
  const { saveSelection } = useContext(CanvasContext);
  return saveSelection;
};

export const useEditorContext = (): UseCanvasManagerResult["context"] => {
  const { context } = useContext(CanvasContext);
  return context;
};
