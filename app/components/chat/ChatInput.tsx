import { KeyboardEvent } from "react";
import { SketchInput } from "./SketchInput";
import { getImageFromCanvas } from "@/app/helpers/extractImage";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef } from "react";
import { useAppStore } from "@/app/store";
import { SendMessage } from "./Chat";
import { CircleAlert } from "lucide-react";

type Props = {
  sendMessage: (options: SendMessage) => void;
  error: string | null;
  emptyChat: boolean;
};

export const ChatInput = ({ sendMessage, error, emptyChat }: Props) => {
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const textInput = useAppStore((state) => state.textInput);
  const setTextInput = useAppStore((state) => state.setTextInput);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleSendMessage = async () => {
    const sketchInput = await getImageFromCanvas(drawingCanvasRef.current);
    sendMessage({
      textInput,
      sketchInput,
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = () => {
    const el = textareaRef.current;

    if (el) {
      if (el.value.includes("\n")) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight + 2}px`;
      } else {
        el.style.height = "auto";
        el.style.height = "48px";
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
      {error && (
        <div role="alert" className="alert">
          <CircleAlert size={16} />
          <span>{error}</span>
        </div>
      )}
      {emptyChat && (
        <div className="text-center">
          <p className="text-lg">Draw and/or describe what you want to make.</p>
          <p className="text-xs text-[#666]">Quick tip: Start with simple geometry.</p>
          <div className="flex flex-row justify-center mt-4">
            <SketchInput
              ref={drawingCanvasRef}
              showControls
              width={256}
              height={256}
              onClear={() => {
                drawingCanvasRef.current?.clearCanvas();
              }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-row gap-4 items-end">
        <textarea
          className="flex-1 h-[48px] max-h-[400px] textarea textarea-primary"
          placeholder={emptyChat ? "Enter a description..." : "Enter a request..."}
          value={textInput}
          ref={textareaRef}
          onChange={(event) => setTextInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInputChange}
        />
        <button className="btn btn-primary" onClick={handleSendMessage} disabled={sendingMessage}>
          Send {sendingMessage && <span className="loading loading-spinner loading-sm"></span>}
        </button>
      </div>
    </div>
  );
};
