"use client";

import * as jscad from "@jscad/modeling";
import { llmConnector } from "@/app/helpers/llmConnector";
import { useAppStore } from "@/app/store";
import { LLMCodeMessage, LLMErrorMessage, LLMMessage, LLMModelMessage, LLMTextMessage } from "@/app/types/llm";
import { KeyboardEvent, ReactNode, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { CodeMessage } from "./CodeMessage";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { SketchInput } from "./SketchInput";
import { getImageFromCanvas } from "@/app/helpers/extractImage";
import { SketchMessage } from "./SketchMessage";
import { buildMessageHistory } from "@/app/helpers/buildMessageHistory";
import { extractCodeFromMessage } from "@/app/helpers/extractCodeFromMessage";
import { geometryTransformer } from "@/app/helpers/geometryTransformer";
import { extractError } from "@/app/helpers/extractError";
import { ModelMessage } from "./ModelMessage";
import { ErrorMessage } from "./ErrorMessage";
import { mergeImages } from "@/app/helpers/mergeImages";
import { CircleAlert } from "lucide-react";
import { MessageGroup } from "./MessageGroup";

export const Chat = () => {
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const error = useAppStore((state) => state.error);
  const sendingMessage = useAppStore((state) => state.sendingMessage);
  const textInput = useAppStore((state) => state.textInput);
  const model = useAppStore((state) => state.model);
  const autoRetry = useAppStore((state) => state.autoRetry);
  const maxRetryCount = useAppStore((state) => state.maxRetryCount);
  const setTextInput = useAppStore((state) => state.setTextInput);
  const setImageInput = useAppStore((state) => state.setImageInput);
  const setError = useAppStore((state) => state.setError);
  const setSendingMessage = useAppStore((state) => state.setSendingMessage);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const drawingCanvasRef = useRef<ReactSketchCanvasRef>(null);

  const sendMessage = async ({
    textInput,
    imageInput,
    hiddenInput,
    modelNormalMapImages,
    codeInput,
    sendFromIndex = Infinity,
    overrideMessages = messages,
  }: {
    textInput?: string;
    imageInput?: string;
    hiddenInput?: string;
    modelNormalMapImages?: string;
    codeInput?: string;
    sendFromIndex?: number;
    overrideMessages?: LLMMessage[];
  } = {}) => {
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

    if (overrideMessages.length === 0) {
      const image = await getImageFromCanvas(drawingCanvasRef.current);
      const userMessage: LLMMessage = {
        role: "user",
        type: "image",
        label: "sketch",
        image,
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

    try {
      // Generate code if there is no code input
      let textWithCode =
        codeInput ?? (await llmConnector[model](buildMessageHistory(filteredMessages, "generate-model")));

      if (typeof textWithCode === "object" && "error" in textWithCode) {
        setError(textWithCode.error);
        setSendingMessage(false);
        return;
      }

      try {
        if (autoRetry) {
          for (let i = 0; i < maxRetryCount; i++) {
            const messages = runCodeFromTextWithCode(textWithCode);
            filteredMessages.push(...messages);
            setMessages(filteredMessages);
            if (messages[messages.length - 1].type !== "error") {
              break;
            }
            textWithCode = (await llmConnector[model](buildMessageHistory(filteredMessages, "fix-error"))) as string;
          }
        } else {
          const messages = runCodeFromTextWithCode(textWithCode);
          filteredMessages.push(...messages);
          setMessages(filteredMessages);
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

    setSendingMessage(false);
  };

  const runCodeFromTextWithCode = (textWithCode: string) => {
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
        hidden: true,
        text: error,
        date: new Date().toISOString(),
      };
    }
  };

  const applyRequestToModel = async (
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
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage({ textInput });
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

  const onRunCode = async (codeInput: string, index: number) => {
    sendMessage({ codeInput, sendFromIndex: index - 1 });
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="flex flex-col max-h-full overflow-y-auto overflow-x-hidden">
        {
          messages.reduce(
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
                  group.messages.push(history.pop());
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
          ).history
        }
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-base-100 z-20 pt-4 pb-6 px-4"
        style={{
          boxShadow: "0 0 20px 5px var(--fallback-b1,oklch(var(--b1)))",
        }}
      >
        <div className="flex flex-col gap-4 max-w-[800px] mx-auto">
          {messages.length === 0 && (
            <div className="text-center">
              <p className="text-lg">Draw and/or describe what you want to make.</p>
              <p className="text-xs text-[#666]">Quick tip: Start with simple geometry in 2D.</p>
              <div className="flex flex-row justify-center mt-4">
                <SketchInput
                  ref={drawingCanvasRef}
                  showControls
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
              placeholder="Enter a description..."
              value={textInput}
              ref={textareaRef}
              onChange={(event) => setTextInput(event.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInputChange}
            />
            <button className="btn btn-primary" onClick={() => sendMessage({ textInput })} disabled={sendingMessage}>
              Send {sendingMessage && <span className="loading loading-spinner loading-sm"></span>}
            </button>
          </div>
        </div>
      </div>
      {error && (
        <div role="alert" className="alert">
          <CircleAlert size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
