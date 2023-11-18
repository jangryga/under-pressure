import { LexerWrapper, TokenCategory, TokenKind } from "lexer-rs";
import {
  CanvasProvider,
  useCanvasContext,
  useRenderElement,
  useUpdateContext,
} from "./canvas_context";
import { useEffect, useRef, useState } from "react";

const context: {
  savedSelection: {
    start: number;
    end: number;
  };
  parsedContent: any;
} = {
  savedSelection: {
    start: 0,
    end: 0,
  },
  parsedContent: "",
};

function saveSelection(containerEl: HTMLDivElement) {
  const range = window.getSelection()?.getRangeAt(0);
  const preSelectionRange = range?.cloneRange();
  preSelectionRange?.selectNodeContents(containerEl);
  preSelectionRange!.setEnd(range!.startContainer, range!.startOffset);
  const start = preSelectionRange!.toString().length;

  context.savedSelection = { start: start, end: start + range!.toString().length };
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
      const textNode = node as Text; // TypeScript type assertion
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
  // const context = useCanvasContext();
  const updateContext = useUpdateContext();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div>
      <Elements />
      <div
        ref={ref}
        contentEditable
        className="w-full h-full focus:outline-none"
        onInput={(_) => {
          saveSelection(ref.current!);
          updateContext(ref.current!.innerText);
        }}
      />
    </div>
  );
}

function Elements() {
  const grid = useCanvasContext().grid;
  return <div>{grid.rows.map((row) => row.elements)}</div>;

  return (
    <>
      {/* {tree.map((e, idx) => (
        <div key={idx}>{e}</div>
      ))} */}
    </>
  );
}

function EditorWrapper() {
  return (
    <div className="w-full md:w-[700px] lg:w-[1000px] bg-primary-900 h-[600px] border border-[#383838]">
      <Canvas />
    </div>
  );
}

export function TextEditor() {
  return (
    <CanvasProvider initialContext={{ lexer: new LexerWrapper(), tokens: [], grid: { rows: [] } }}>
      <EditorWrapper />
    </CanvasProvider>
  );
}
