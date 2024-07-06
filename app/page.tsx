import { Chat } from "./components/chat/Chat";

export default function Home() {
  return (
    <main className="w-screen max-w-[800px] mx-auto pt-[180px] pb-[100px] px-4">
      <div
        className="fixed top-0 left-0 right-0 bg-base-100 z-20 pt-4 pb-6 px-4"
        style={{
          boxShadow: "0 0 20px 5px var(--fallback-b1,oklch(var(--b1)))",
        }}
      >
        <h1 className="text-4xl text-center my-4">ClaudeCAD</h1>
        <p className="text-base text-center">Making models for 3D printing even more intuitive.</p>
      </div>
      <Chat />
    </main>
  );
}
