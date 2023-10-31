import { ReactNode, useState } from "react";

export default function App() {
  return (
    <Container>
      <EditorContainer />
    </Container>
  );
}

function Editor() {
  const [content, setContent] = useState<string>("");
  return (
    <div
      contentEditable
      className="w-full h-full focus:outline-none pl-4"
      onChange={(e) => setContent(e.currentTarget.innerHTML)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

function EditorContainer() {
  return (
    <div className="w-full md:w-[700px] lg:w-[1000px] bg-primary-900 h-[600px] border border-[#383838]">
      <Editor />
    </div>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <body className="w-screen bg-primary-900 h-screen text-gray-100 flex">
      <div className="max-w-7xl m-auto">{children}</div>
    </body>
  );
}
