import { ReactNode } from "react";
import { TextEditor } from "./lib/Canvas";
import { useRef, useEffect, useState } from "react";

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<any>();
  const [view, setView] = useState<number>(0);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    console.log(selection);
  }, [selection?.anchorNode]);
  return (
    <Container>
      <button
        onClick={() => setView(view === 0 ? 1 : 0)}
        className="bg-[#2f23d1] rounded-sm text-white px-2 py-1 mb-3 absolute top-0 left-0"
        type="button">
        Toggle View
      </button>
      <div className="h-16"></div>
      {view === 0 ? (
        <>
          <ButtonMenu>
            <button
              onClick={() => console.log(document.getSelection())}
              className="bg-[#2f23d1] rounded-sm text-white px-2 py-1 mb-3"
              type="button">
              Debug
            </button>
            <button
              className="bg-[#2f23d1] rounded-sm text-white px-2 py-1 mb-3"
              onClick={() => {
                const range = new Range();
                range.setStart(ref.current!, 1);
                range.setEnd(ref.current!, 2);
                range.collapse(true);
                const selection = document.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(range);
              }}>
              Set Range
            </button>
          </ButtonMenu>
          <div
            ref={ref}
            className="w-[700px] focus:outline-none h-[400px] border border-gray-600"
            contentEditable
          />
        </>
      ) : (
        <TextEditor config={{ debugMode: true }} />
      )}
    </Container>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen bg-primary-900 h-screen text-gray-100 flex ">
      <div className="w-[1080px] m-auto h-full relative">{children}</div>
    </div>
  );
}

function ButtonMenu({ children }: { children: ReactNode }) {
  return <div className="flex gap-2">{children}</div>;
}
