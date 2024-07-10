"use client";

import * as jscad from "@jscad/modeling";
import { llmConnector } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import {
  LLMCodeMessage,
  LLMErrorMessage,
  LLMMessage,
  LLMModel,
  LLMModelMessage,
  LLMTextMessage,
} from "@/app/types/llm";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { CodeMessage } from "./CodeMessage";
import { SketchMessage } from "./SketchMessage";
import { buildMessageHistory } from "@/app/helpers/buildMessageHistory";
import { extractCodeFromMessage } from "@/app/helpers/extractCodeFromMessage";
import { geometryTransformer } from "@/app/helpers/geometryTransformer";
import { extractError } from "@/app/helpers/extractError";
import { ModelMessage } from "./ModelMessage";
import { ErrorMessage } from "./ErrorMessage";
import { mergeImages } from "@/app/helpers/mergeImages";
import { Trash } from "lucide-react";
import { MessageGroup } from "./MessageGroup";
import { ChatInput } from "./ChatInput";

export type SendMessage = {
  textInput?: string;
  imageInput?: string;
  sketchInput?: string;
  hiddenInput?: string;
  modelNormalMapImages?: string;
  codeInput?: string;
  sendFromIndex?: number;
  overrideMessages?: LLMMessage[];
};

export const Chat = () => {
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [history, setHistory] = useState<ReactNode[]>([]);
  const [updateUI, setUpdateUI] = useState<string>("");
  const error = useAppStore((state) => state.error);
  const model = useAppStore((state) => state.model);
  const autoRetry = useAppStore((state) => state.autoRetry);
  const maxRetryCount = useAppStore((state) => state.maxRetryCount);
  const setTextInput = useAppStore((state) => state.setTextInput);
  const setImageInput = useAppStore((state) => state.setImageInput);
  const setError = useAppStore((state) => state.setError);
  const setSendingMessage = useAppStore((state) => state.setSendingMessage);

  const anchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottomDelayed = useCallback((delay = 100) => {
    setTimeout(() => {
      anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, delay);
  }, []);

  const forceUpdateUI = () => {
    setUpdateUI(new Date().toISOString());
  };

  const sendMessage = useCallback(
    async ({
      textInput,
      imageInput,
      sketchInput,
      hiddenInput,
      modelNormalMapImages,
      codeInput,
      sendFromIndex = Infinity,
      overrideMessages = messages,
    }: SendMessage = {}) => {
      setError(null);
      setTextInput("");
      setImageInput("");
      setSendingMessage(true);

      const filteredMessages = [...overrideMessages].filter((_, index) => index <= sendFromIndex);

      if (hiddenInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "text",
          label: "request",
          text: hiddenInput,
          hidden: true,
          hiddenText: null,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      if (textInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "text",
          label: "request",
          text: textInput,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      if (sketchInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "image",
          label: "sketch",
          image: sketchInput,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      if (imageInput) {
        const userMessage: LLMMessage = {
          role: "user",
          type: "image",
          label: "model-with-sketch",
          image: imageInput,
          model,
          date: new Date().toISOString(),
        };
        filteredMessages.push(userMessage);
      }

      if (modelNormalMapImages) {
        const normalMappingImagesMessage: LLMMessage = {
          role: "user",
          type: "image",
          label: "normal-mapping",
          image: modelNormalMapImages,
          model,
          date: new Date().toISOString(),
          editable: false,
          hidden: true,
          hiddenText: "Hidden normal map representation of the model.",
        };
        filteredMessages.push(normalMappingImagesMessage);
      }

      setMessages(filteredMessages);
      scrollToBottomDelayed();

      try {
        // Generate code if there is no code input
        let textWithCode =
          codeInput ?? (await llmConnector[model](buildMessageHistory(filteredMessages, "generate-model")));

        if (typeof textWithCode === "object" && "error" in textWithCode) {
          setError(textWithCode.error);
          setSendingMessage(false);
          scrollToBottomDelayed();
          return;
        }

        try {
          if (autoRetry) {
            for (let i = 0; i < maxRetryCount; i++) {
              const messages = runCodeFromTextWithCode(textWithCode, model);
              filteredMessages.push(...messages);
              setMessages(filteredMessages);
              forceUpdateUI();
              scrollToBottomDelayed();
              if (filteredMessages[filteredMessages.length - 1].type !== "error") {
                break;
              }
              textWithCode = (await llmConnector[model](buildMessageHistory(filteredMessages, "fix-error"))) as string;
            }
            if (filteredMessages[filteredMessages.length - 1].type === "error") {
              const assistantMessage: LLMTextMessage = {
                role: "assistant",
                type: "text",
                label: "assistant-no-code",
                text: "I'm sorry, I couldn't fix the error after 4 attempts. You may want to try again with a different description or sketch.",
                model,
                date: new Date().toISOString(),
              };
              filteredMessages.push(assistantMessage);
              setMessages(filteredMessages);
              forceUpdateUI();
              scrollToBottomDelayed();
            }
          } else {
            const messages = runCodeFromTextWithCode(textWithCode, model);
            filteredMessages.push(...messages);
            setMessages(filteredMessages);
            forceUpdateUI();
            scrollToBottomDelayed();
          }
        } catch (e) {
          console.log(e);

          const assistantMessage: LLMTextMessage = {
            role: "assistant",
            type: "text",
            label: "assistant-no-code",
            text: textWithCode,
            model,
            date: new Date().toISOString(),
          };

          filteredMessages.push(assistantMessage);
          setMessages(filteredMessages);
          forceUpdateUI();
          scrollToBottomDelayed();
        }

        setTextInput("");
        setImageInput("");
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        console.error(error);
        if (textInput) setTextInput(textInput);
        if (imageInput) setImageInput(imageInput);
      }

      forceUpdateUI();
      scrollToBottomDelayed();
      setSendingMessage(false);
    },
    [
      setError,
      setTextInput,
      setImageInput,
      setSendingMessage,
      setMessages,
      messages,
      model,
      autoRetry,
      maxRetryCount,
      scrollToBottomDelayed,
    ]
  );

  const applyRequestToModel = useCallback(
    async (
      sketch: string,
      modelImage: string,
      modelNormalMapImages: string,
      request: string,
      sendFromIndex: number
    ) => {
      let hiddenInput = "";
      if (modelImage) {
        hiddenInput = "This is an image of the rendered 3D model.";
      }
      if (sketch) {
        hiddenInput = "This is a sketch of what I want to make.";
      }
      if (modelImage && sketch) {
        hiddenInput = "This is an image of the rendered 3D model, with sketch applied.";
      }
      if (request) {
        hiddenInput += " I want you to apply this request, in the next message, on the 3D model:";
      }
      const imageInput = (await mergeImages([modelImage, sketch])) || sketch || modelImage;
      const modelNormalMapImagesWithSketch =
        (await mergeImages([modelNormalMapImages, sketch], {
          positions: [
            { x: 0, y: 0 },
            { x: 128, y: 128 },
          ],
          sizes: [
            { width: 256, height: 256 },
            { width: 128, height: 128 },
          ],
        })) || modelNormalMapImages;

      sendMessage({
        textInput: request,
        imageInput,
        hiddenInput,
        modelNormalMapImages: modelNormalMapImagesWithSketch,
        sendFromIndex,
      });
    },
    [sendMessage]
  );

  const handleResetChatButton = () => {
    window.location.reload();
  };

  const updateMessage = useCallback(
    (message: LLMMessage, index: number) => {
      const newMessages = [...messages];
      newMessages[index] = message;
      setMessages(newMessages);
    },
    [messages]
  );

  const deleteMessage = useCallback(
    (index: number) => {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      setMessages(newMessages);
    },
    [messages]
  );

  const onRerun = useCallback(
    async (index: number) => {
      sendMessage({ sendFromIndex: index });
    },
    [sendMessage]
  );

  const onRunCode = useCallback(
    async (codeInput: string, index: number) => {
      sendMessage({ codeInput, sendFromIndex: index - 1 });
    },
    [sendMessage]
  );

  useEffect(() => {
    const history: ReactNode[] = messages.reduce(
      (acc, message, index) => {
        const history = [...acc.history];
        const prevMessage = { ...acc.prevMessage };
        const group = { ...acc.group };

        let messageElement = null;

        if (message.type === "text") {
          messageElement = (
            <ChatMessage
              key={message.type + index}
              message={message}
              onChange={(message) => updateMessage(message, index)}
              onDelete={() => deleteMessage(index)}
              onRerun={() => onRerun(index)}
            />
          );

          if (prevMessage?.type === "error" && group.type === "fixCode") {
            history.pop();
            history.push(<MessageGroup key={"group" + index} type={"fixCode"} messages={group.messages} />);
            group.type = null;
            group.messages = [];
          }
        }

        if (message.type === "code") {
          messageElement = (
            <CodeMessage
              key={message.type + index}
              message={message}
              onChange={(message) => updateMessage(message, index)}
              onDelete={() => deleteMessage(index)}
              onRun={(code) => onRunCode(code, index)}
            />
          );
        }

        if (message.type === "image") {
          messageElement = (
            <SketchMessage
              key={message.type + index}
              message={message}
              onChange={(message) => updateMessage(message, index)}
              onDelete={() => deleteMessage(index)}
              onRerun={() => onRerun(index)}
            />
          );
        }

        if (message.type === "model") {
          messageElement = (
            <ModelMessage
              key={message.type + index}
              message={message}
              onSketch={(sketch, modelImage, modelNormalMapImages, request) =>
                applyRequestToModel(sketch, modelImage, modelNormalMapImages, request, index)
              }
              onDelete={() => deleteMessage(index)}
            />
          );

          if (prevMessage?.type === "code" && group.type === "fixCode") {
            history.pop();
            history.push(<MessageGroup key={"group" + index} type={"fixCode"} messages={group.messages} />);
            group.type = null;
            group.messages = [];
          }
        }

        if (message.type === "error") {
          messageElement = (
            <ErrorMessage
              key={message.type + index}
              message={message}
              onFix={() => sendMessage({ sendFromIndex: index })}
              onDelete={() => deleteMessage(index)}
            />
          );

          if (prevMessage?.type === "code" && group.type === null) {
            group.type = "fixCode";
            group.messages.push(acc.prevMessageElement);
          }
        }

        if (group.type) {
          group.messages.push(messageElement);
          history.pop();
          history.push(<MessageGroup key="group" type={group.type} messages={group.messages} loading />);
        } else {
          history.push(messageElement);
        }

        return { history, prevMessage: message, prevMessageElement: messageElement, group };
      },
      {
        history: [],
        prevMessage: messages[0],
        prevMessageElement: null,
        group: { type: null, messages: [] },
      } as {
        history: ReactNode[];
        prevMessage: LLMMessage;
        prevMessageElement: ReactNode;
        group: { type: "fixCode" | null; messages: ReactNode[] };
      }
    ).history;
    setHistory(history);
  }, [messages, updateUI, applyRequestToModel, onRerun, onRunCode, deleteMessage, sendMessage, updateMessage]);

  return (
    <div className="w-full flex flex-col">
      <div
        className="flex flex-col justify-end overflow-y-auto overflow-x-hidden"
        style={{ minHeight: messages.length > 0 ? "calc(100vh - 175px)" : "auto" }}
      >
        <div className="flex-1" />
        {history}
        {messages.length !== 0 && (
          <button className="btn btn-error self-center mt-10" onClick={handleResetChatButton}>
            Reset chat <Trash size={16} />
          </button>
        )}
        <div ref={anchorRef} className="mt-8" />
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-base-100 z-20 pt-4 pb-6 px-4"
        style={{
          boxShadow: "0 0 20px 5px var(--fallback-b1,oklch(var(--b1)))",
        }}
      >
        <ChatInput sendMessage={sendMessage} error={error} emptyChat={messages.length === 0} />
      </div>
    </div>
  );
};

const runCodeFromTextWithCode = (textWithCode: string, model: LLMModel) => {
  const code = extractCodeFromMessage(textWithCode);
  const messages = [];

  const assistantMessage: LLMCodeMessage = {
    role: "assistant",
    type: "code",
    text: code,
    model,
    date: new Date().toISOString(),
    hidden: true,
  };
  messages.push(assistantMessage);

  const runMessage = runCode(code);
  messages.push(runMessage);

  return messages;
};

const runCode = (code: string): LLMModelMessage | LLMErrorMessage => {
  try {
    const originalGeometries = new Function("jscad", code)(jscad);
    const geometries = geometryTransformer(originalGeometries);
    return {
      type: "model",
      role: "user",
      geometries,
      originalGeometries,
      date: new Date().toISOString(),
    };
  } catch (e: any) {
    const details = extractError(e);
    let error = `${details.type}: ${details.message}`;
    if (details.lineNumber) {
      error += ` at ${details.lineNumber}`;
      if (details.columnNumber) {
        error += `:${details.columnNumber}`;
      }
    }
    console.log(e);
    return {
      type: "error",
      role: "user",
      text: error,
      date: new Date().toISOString(),
    };
  }
};
