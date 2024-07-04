"use client";

import { llmConnector } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import { LLMMessage } from "@/app/types/llm";
import { KeyboardEvent, useRef } from "react";

export const Chat = () => {
  const messages = useAppStore((state) => state.messages);
  const error = useAppStore((state) => state.error);
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const textInput = useAppStore((state) => state.textInput);
  const imageInput = useAppStore((state) => state.imageInput);
  const model = useAppStore((state) => state.model);
  const setTextInput = useAppStore((state) => state.setTextInput);
  const setImageInput = useAppStore((state) => state.setImageInput);
  const setError = useAppStore((state) => state.setError);
  const setSendingMessage = useAppStore((state) => state.setSendingMessage);
  const setMessages = useAppStore((state) => state.setMessages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    if (textInput === "" && imageInput === "") {
      setError("Please enter a message or upload an image.");
      return;
    }

    setError(null);
    setSendingMessage(true);

    try {
      const userMessage: LLMMessage = {
        role: "user",
        type: "text",
        text: textInput,
        model,
        date: new Date().toISOString(),
      };
      setMessages([...messages, userMessage]);

      const data = await llmConnector[model]([...messages, userMessage]);

      const assistantMessage: LLMMessage = {
        role: "assistant",
        type: "text",
        text: data,
        model,
        date: new Date().toISOString(),
      };

      console.log(data);

      setMessages([...messages, assistantMessage]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      console.error(error);
    }

    setTextInput("");
    setImageInput("");
    setSendingMessage(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage();
    }
  };

  const handleInputChange = () => {
    const el = textareaRef.current;

    if (el) {
      if (el.value.includes("\n")) {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
      } else {
        el.style.height = "auto";
        el.style.height = "48px";
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <div key={index} className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}>
            <div className="chat-header">{message.model}</div>
            <div className="chat-bubble">
              {message.type === "text" && <p>{message.text}</p>}
              {message.type === "image" && <img src={message.image} alt="Uploaded" />}
            </div>
            <div className="chat-footer opacity-50">Sent {new Date(message.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-row items-end gap-4 m-4">
        <textarea
          className="flex-1 h-[48px] textarea textarea-primary"
          placeholder="Enter a message..."
          value={textInput}
          ref={textareaRef}
          onChange={(event) => setTextInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInputChange}
        />
        <button className="btn btn-primary" onClick={sendMessage} disabled={sendingMessage}>
          Send
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
