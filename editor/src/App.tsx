import { ReactNode } from "react";
import { TextEditor } from "./lib/canvas";

export default function App() {
  return (
    <Container>
      <TextEditor />
    </Container>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <body className="w-screen bg-primary-900 h-screen text-gray-100 flex">
      <div className="max-w-7xl m-auto">{children}</div>
    </body>
  );
}
