import { TokenType, LexerWrapper } from "lexer-rs";
import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";
import { Grid, gridify } from "./canvas_grid";

export function restoreSelection(containerEl: HTMLDivElement, savedSel: BasicSelection) {
  let charIndex = 0;
  let range = document.createRange();
  range.setStart(containerEl, 0);
  range.collapse(true);
  let nodeStack: Node[] = [containerEl];
  let node: Node | undefined;
  let foundStart = false;
  let stop = false;

  while (!stop && (node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      const nextCharIndex = charIndex + textNode.length;
      // todo: on node level, should we have this comparison based on the max depth (max selection length)? or does the selection start change when we do setStartAfter() ?
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
    } else if (node.nodeName === "BR") {
      range.setStartAfter(node);
      range.setEndAfter(node);
    } else {
      let i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }

  const sel = window.getSelection();
  sel!.removeAllRanges();
  sel!.addRange(range);
}
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
