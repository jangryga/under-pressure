import { ReactNode } from "react";
import { TextEditor } from "./lib/Canvas";

export default function App() {
  return (
    <Container>
      <TextEditor config={{ debugMode: true }} />
    </Container>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="w-screen bg-primary-900 h-screen text-gray-100 flex">
      <div className="max-w-7xl m-auto">{children}</div>
    </div>
  );
}
