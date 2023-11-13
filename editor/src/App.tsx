import { ReactNode, useState, useEffect, useRef } from "react";
import { CanvasProvider, useCanvasContext, useUpdateContext } from "./lib/canvas_manager";
import { LexerWrapper } from "lexer-rs";

export default function App() {
  return (
    <CanvasProvider initialContext={{ lexer: new LexerWrapper(), tokens: [], tree: <div /> }}>
      <Container>
        <EditorContainer />
      </Container>
    </CanvasProvider>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <body className="w-screen bg-primary-900 h-screen text-gray-100 flex">
      <div className="max-w-7xl m-auto">{children}</div>
    </body>
  );
}

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

function Editor() {
  const context = useCanvasContext();
  const updateContext = useUpdateContext();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div>{JSON.stringify(context.tokens)}</div>
      <div
        ref={ref}
        contentEditable
        className="w-full h-full focus:outline-none pl-4"
        onInput={(e) => {
          saveSelection(ref.current!);
          // setContent(e.currentTarget.textContent ?? "");
          updateContext(e.currentTarget.textContent ?? "");
        }}
      />
    </div>
  );
}

// function Editor() {
//   const [content, setContent] = useState<string>("");

//   useEffect(() => {
//     ref.current!.innerHTML = content;
//     restoreSelection(ref.current!, context.savedSelection);
//     console.log(canvas.tokenize(content));
//   }, [content]);

//   return (
//     <>

//       />
//       {/* <button
//         onClick={() => {
//           console.log(content);
//           let parsed = parse(content);
//           console.log(parsed);
//         }}>
//         Parse
//       </button> */}
//       <button onClick={() => console.log(window.getSelection())}>curr selection</button>
//     </>
//   );
// }

function EditorContainer() {
  return (
    <div className="w-full md:w-[700px] lg:w-[1000px] bg-primary-900 h-[600px] border border-[#383838]">
      <Editor />
    </div>
  );
}
