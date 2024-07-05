"use client";

import { llmConnector } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import { LLMMessage, LLMTextMessage } from "@/app/types/llm";
import { KeyboardEvent, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchInput } from "./SketchInput";
import { getImageFromCanvas } from "@/app/helpers/extractImage";
import { SketchMessage } from "./SketchMessage";

export const Chat = () => {
  const messages = useAppStore((state) => state.messages);
  const error = useAppStore((state) => state.error);
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const textInput = useAppStore((state) => state.textInput);
  const model = useAppStore((state) => state.model);
  const setTextInput = useAppStore((state) => state.setTextInput);
  const setImageInput = useAppStore((state) => state.setImageInput);
  const setError = useAppStore((state) => state.setError);
  const setSendingMessage = useAppStore((state) => state.setSendingMessage);
  const setMessages = useAppStore((state) => state.setMessages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);

  const sendMessage = async ({
    textInput,
    imageInput,
    sendFromIndex = Infinity,
  }: { textInput?: string; imageInput?: string; sendFromIndex?: number } = {}) => {
    setError(null);
    setTextInput("");
    setImageInput("");
    setSendingMessage(true);

    try {
      const filteredMessages = [...messages].filter((_, index) => index <= sendFromIndex);

      if (textInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "text",
          text: textInput,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      if (imageInput) {
        const image = await getImageFromCanvas(drawingCanvasRef.current);

        if (image) {
          const userMessage: LLMMessage = {
            role: "user",
            type: "image",
            image,
            model,
            date: new Date().toISOString(),
          };
          filteredMessages.push(userMessage);
        }
      }

      setMessages(filteredMessages);

      const text = await llmConnector[model](filteredMessages);

      const assistantMessage: LLMMessage = {
        role: "assistant",
        type: "text",
        text,
        model,
        date: new Date().toISOString(),
      };

      filteredMessages.push(assistantMessage);

      console.log(text);

      setMessages(filteredMessages);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error(error);
      if (textInput) setImageInput(textInput);
    }

    setTextInput("");
    setImageInput("");
    setSendingMessage(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage({ textInput, imageInput: messages.length === 0 ? "init" : "" });
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

  const updateMessage = (message: LLMMessage, index: number) => {
    const newMessages = [...messages];
    newMessages[index] = message;
    setMessages(newMessages);
  };

  const deleteMessage = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const onRerun = async (index: number) => {
    sendMessage({ sendFromIndex: index });
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex flex-col max-h-full overflow-y-auto overflow-x-hidden">
        {messages.map((message, index) =>
          message.type === "text" ? (
            <ChatMessage
              key={index}
              message={message}
              onChange={(message) => updateMessage(message, index)}
              onDelete={() => deleteMessage(index)}
              onRerun={() => onRerun(index)}
            />
          ) : (
            <SketchMessage
              key={index}
              message={message}
              onChange={(message) => updateMessage(message, index)}
              onDelete={() => deleteMessage(index)}
              onRerun={() => onRerun(index)}
            />
          )
        )}
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-base-100 z-10 pt-4 pb-6"
        style={{
          boxShadow: "0 0 20px 5px var(--fallback-b1,oklch(var(--b1)))",
        }}
      >
        <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
          {messages.length === 0 && (
            <div className="text-center">
              <p className="text-lg">Draw or type what you want to make.</p>
              <p className="text-xs text-[#666]">Quick tip: Start with simple geometry in 2D.</p>
              <div className="flex flex-row justify-center mt-4">
                <SketchInput
                  ref={drawingCanvasRef}
                  width={420}
                  height={420}
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
              placeholder="Enter a message..."
              value={textInput}
              ref={textareaRef}
              onChange={(event) => setTextInput(event.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
            />
            <button
              className="btn btn-primary"
              onClick={() => sendMessage({ textInput, imageInput: messages.length === 0 ? "init" : "" })}
              disabled={sendingMessage}
            >
              Send {sendingMessage && <span className="loading loading-spinner loading-sm"></span>}
            </button>
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
