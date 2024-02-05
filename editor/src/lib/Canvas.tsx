import { LexerWrapper, TokenType } from "lexer-rs";
import {
  CanvasProvider,
  useEditorContext,
  useUpdateUpdateEditorState,
  useSaveEditorSelection,
  useRestoreSelection,
} from "./canvas_context";
import { useEffect, useRef } from "react";

function Canvas() {
  const updateEditorState = useUpdateUpdateEditorState();
  const saveSelection = useSaveEditorSelection();
  const restoreSelection = useRestoreSelection();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="w-full h-full focus:outline-none"
        onSelect={() => {
          saveSelection(ref.current!);
        }}
        onInput={() => {
          saveSelection(ref.current!);
          updateEditorState(ref.current!.innerText);
          restoreSelection(ref.current!);
        }}
      />
    </div>
  );
}

function batchTokenLines(tokens: TokenType[]): TokenType[][] {
  const elements: TokenType[][] = [];
  let current: TokenType[] = [];
  for (const t of tokens) {
    if (t.kind === "Newline") {
      elements.push(current);
      current = [t];
    } else {
      current.push(t);
    }
  }
  if (current) elements.push(current);
  return elements;
}

function DebugPanel() {
  const context = useEditorContext();
  const tokens = context.tokens;
  const gridRows = context.grid.rows;

  return (
    <>
      <h4>Debug view</h4>
      <div className="grid grid-cols-2 border border-[#383838] mb-2 h-[300px]">
        <div className="border-r border-[#383838] col-span-1">
          <div className="border-b border-[#383838] h-[40%] overflow-y-auto">
            {context.debugger.input.join(" ")}
          </div>
          <ul className=" overflow-y-auto h-[60%] max-h-[180px]">
            {batchTokenLines(tokens).map((tokens, idx) => (
              <li key={idx} className="overflow-x-hidden">
                {tokens
                  .map((t) => {
                    if (t.value) return `${t.kind}+${t.value}+${t.category}`;
                    return t.kind;
                  })
                  .join(" | ")}
              </li>
            ))}
          </ul>
        </div>
        <ul className="col-span-1 overflow-y-auto max-h-[300px]">
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
      {debugMode && (
        <>
          <DebugPanel />
          <div className="flex gap-2"></div>
        </>
      )}
      <div className="w-full md:w-[700px] lg:w-[1080px] bg-primary-900 h-[600px] border border-[#383838]">
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
        selection: null,
        debugger: {
          encoder: new TextEncoder(),
          input: [],
        },
      }}>
      <EditorWrapper {...props.config} />
    </CanvasProvider>
  );
}

interface EditorConfig {
  debugMode: boolean;
}
