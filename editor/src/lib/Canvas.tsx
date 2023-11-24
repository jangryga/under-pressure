import { LexerWrapper } from "lexer-rs";
import {
  CanvasProvider,
  useEditorContext,
  useUpdateUpdateEditorState,
  useSaveEditorSelection,
} from "./canvas_context";
import { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { saveSelectionInternal, restoreSelection } from "./selection";

function Canvas() {
  const context = useEditorContext();
  const updateState = useUpdateUpdateEditorState();
  const saveSelection = useSaveEditorSelection();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    ref.current!.innerHTML = ReactDOMServer.renderToString(
      <>{context.grid.rows.map((row) => row.elements)}</>,
    );
    restoreSelection(ref.current!, context.selection);
  }, [context.grid]);

  return (
    <div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="w-full h-full focus:outline-none"
        onInput={(_) => {
          updateState(ref.current!.innerText);
        }}
      />
    </div>
  );
}

function DebugPanel() {
  const context = useEditorContext();
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
    <CanvasProvider
      initialContext={{
        lexer: new LexerWrapper(),
        tokens: [],
        grid: { rows: [] },
        selection: { start: 0, end: 0 },
      }}>
      <EditorWrapper {...props.config} />
    </CanvasProvider>
  );
}

interface EditorConfig {
  debugMode: boolean;
}
