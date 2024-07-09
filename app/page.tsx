import { Chat } from "./components/chat/Chat";

export default function Home() {
  return (
    <main className="w-screen max-w-[800px] mx-auto pb-[100px] px-4">
      <div
        className="w-full bg-base-100 z-20 pt-4 pb-12 px-4"
        style={{
          boxShadow: "0 0 20px 5px var(--fallback-b1,oklch(var(--b1)))",
        }}
      >
        <div className="flex flex-row items-center gap-6 max-w-[420px] mx-auto">
          <img src="/icon.png" alt="Logo" className="w-[100px] h-[100px] mx-auto mt-4" />
          <div className="flex-1">
            <h1 className="text-4xl my-4">ClaudeCAD</h1>
            <p className="text-base">Making models for 3D printing intuitive.</p>
          </div>
        </div>
      </div>
      <Chat />
    </main>
  );
}
