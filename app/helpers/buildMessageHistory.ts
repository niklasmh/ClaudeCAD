import { label } from "three/examples/jsm/nodes/Nodes.js";
import { generateCode, normalMappingDescription, requestDescription, sketchDescription } from "../prompts/generateCode";
import { LLMImageMessage, LLMMessage, LLMTextMessage, defaultModel } from "../types/llm";

export const buildMessageHistory = (messages: LLMMessage[], type: "generate-model" | "correct-model" | "fix-error") => {
  if (type === "generate-model") {
    const initialMessage: LLMTextMessage = {
      type: "text",
      text: generateCode(),
      label: "description",
      model: defaultModel,
      role: "user",
      date: new Date().toISOString(),
    };

    let newMessages = [initialMessage, ...messages];

    console.log(newMessages);

    // Replace all, except last two sketch message, with a text message
    newMessages = modifyMessagesOfTypeAfterN<LLMImageMessage>(
      newMessages,
      2,
      (m) => m.type === "image" && m.label === "sketch",
      (m) => ({
        ...m,
        type: "text",
        label: "description",
        text: "Here was an image of a sketched version of the model.",
      })
    );

    // Replace all, except last model request image message (with sketch), with a text message
    newMessages = modifyMessagesOfTypeAfterN<LLMImageMessage>(
      newMessages,
      1,
      (m) => m.type === "image" && m.label === "model-with-sketch",
      (m) => ({ ...m, type: "text", label: "description", text: "Here was an image of the 3D model." })
    );

    // Replace all, except last normal mapping image, with a text message
    newMessages = modifyMessagesOfTypeAfterN<LLMImageMessage>(
      newMessages,
      1,
      (m) => m.type === "image" && m.label === "normal-mapping",
      (m) => ({ ...m, type: "text", label: "description", text: "Here was an image of a normal mapping image." })
    );

    // Add description before sketches
    newMessages = addTextMessageBeforeMessageOfType(
      newMessages,
      sketchDescription(),
      (m) => m.type === "image" && m.label === "sketch"
    );

    // Add description before normal mappings
    newMessages = addTextMessageBeforeMessageOfType(
      newMessages,
      normalMappingDescription(),
      (m) => m.type === "image" && m.label === "normal-mapping"
    );

    // Add description on all requests
    newMessages = modifyMessagesOfType<LLMTextMessage>(
      newMessages,
      (m) => m.type === "text" && m.label === "request",
      (m) => ({ ...m, text: requestDescription(m.text) })
    );

    console.log(newMessages);

    return newMessages;
  }

  return messages.slice(-10);
};

const modifyMessagesOfType = <T extends LLMMessage>(
  messages: LLMMessage[],
  filter: (message: LLMMessage) => boolean,
  modifier: (message: T) => LLMMessage,
  n: number = Infinity,
  skipN: number = 0
): LLMMessage[] => {
  const newMessages: LLMMessage[] = [];

  for (let i = messages.length - 1, count = n, skip = skipN; i >= 0; i--) {
    const message = messages[i];
    if (filter(message)) {
      if (skip > 0) {
        newMessages.push(message);
        skip--;
        continue;
      } else if (count > 0) {
        newMessages.push(modifier(message as T));
        count--;
        continue;
      }
    }
    newMessages.push(message);
  }

  newMessages.reverse();

  return newMessages;
};

const modifyMessagesOfTypeAfterN = <T extends LLMMessage>(
  messages: LLMMessage[],
  n: number,
  filter: (message: LLMMessage) => boolean,
  modifier: (message: T) => LLMMessage
): LLMMessage[] => {
  const newMessages: LLMMessage[] = [];

  for (let i = messages.length - 1, count = n; i >= 0; i--) {
    const message = messages[i];
    if (filter(message)) {
      if (count > 0) {
        newMessages.push(message);
        count--;
      } else {
        newMessages.push(modifier(message as T));
      }
    } else {
      newMessages.push(message);
    }
  }

  newMessages.reverse();

  return newMessages;
};

const addTextMessageBeforeMessageOfType = (
  messages: LLMMessage[],
  text: string,
  filter: (message: LLMMessage) => boolean
): LLMMessage[] => {
  const newMessages: LLMMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (filter(message)) {
      newMessages.push({
        type: "text",
        text,
        label: "description",
        model: "model" in message ? message.model : defaultModel,
        role: message.role,
        date: new Date().toISOString(),
      });
    }
    newMessages.push(message);
  }

  return newMessages;
};
