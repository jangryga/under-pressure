import { LexerWrapper } from "lexer-rs";
import { CanvasProvider, useCanvasContext, useUpdateContext } from "./canvas_context";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";

const selectionContext: {
  savedSelection: {
    start: number;
    end: number;
  };
} = {
  savedSelection: {
    start: 0,
    end: 0,
  },
};

function saveSelection(containerEl: HTMLDivElement) {
  const range = window.getSelection()?.getRangeAt(0);
  const preSelectionRange = range?.cloneRange();
  preSelectionRange?.selectNodeContents(containerEl);
  preSelectionRange!.setEnd(range!.startContainer, range!.startOffset);
  const start = preSelectionRange!.toString().length;

  selectionContext.savedSelection = { start: start, end: start + range!.toString().length };
}

function restoreSelection(containerEl: HTMLDivElement, savedSel: any) {
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
      if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
        range.setStart(textNode, savedSel.start - charIndex);
        foundStart = true;
      }
      if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
        range.setEnd(textNode, savedSel.end - charIndex);
        stop = true;
      }
      charIndex = nextCharIndex;
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

function Canvas() {
  const context = useCanvasContext();
  const updateContext = useUpdateContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    ref.current!.innerHTML = ReactDOMServer.renderToString(
      <>{context.grid.rows.map((row) => row.elements)}</>,
    );
    restoreSelection(ref.current!, selectionContext.savedSelection);
  }, [context.grid]);

  return (
    <div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="w-full h-full focus:outline-none"
        onInput={(_) => {
          saveSelection(ref.current!);
          updateContext(ref.current!.innerText);
        }}
      />
    </div>
  );
}

function DebugPanel() {
  const context = useCanvasContext();
  const tokens = context.tokens;
  const gridRows = context.grid.rows;

  return (
    <>
      <h4>Debug view</h4>
      <div className="grid grid-cols-2 border border-gray-400 mb-2 h-[200px]">
        <ul className="border-r border-gray-400 col-span-1 overflow-y-auto ">
          {tokens.map((token, idx) => (
            <li key={idx}>{token.kind}</li>
          ))}
        </ul>
        <ul className="col-span-1 overflow-y-auto">
          {gridRows.map((row, idx) => (
            <li key={idx} className="border border-red-900 mb-1">
              {row.elements}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function EditorWrapper({ debugMode }: EditorConfig) {
  return (
    <>
      {debugMode && <DebugPanel />}
      <div className="w-full md:w-[700px] lg:w-[1000px] bg-primary-900 h-[600px] border border-[#383838]">
        <Canvas />
      </div>
    </>
  );
}

export function TextEditor(props: { config: EditorConfig }) {
  return (
    <CanvasProvider initialContext={{ lexer: new LexerWrapper(), tokens: [], grid: { rows: [] } }}>
      <EditorWrapper {...props.config} />
    </CanvasProvider>
  );
}

interface EditorConfig {
  debugMode: boolean;
}
