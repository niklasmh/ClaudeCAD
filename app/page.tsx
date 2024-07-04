import { Chat } from "./components/chat/Chat";

export default function Home() {
  return (
    <main className="w-screen max-w-[800px] h-screen mx-auto flex flex-col">
      <h1 className="text-4xl text-center my-4">ClaudeCAD</h1>
      <p className="text-base text-center">Making models for 3D printing even more intuitive.</p>
      <Chat />
    </main>
  );
}
