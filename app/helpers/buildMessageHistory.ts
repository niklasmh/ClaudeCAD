import { generateCode, generateCodeWithImage } from "../prompts/generateCode";
import { LLMImageMessage, LLMMessage, LLMTextMessage } from "../types/llm";

export const buildMessageHistory = (messages: LLMMessage[], type: "generate-model" | "correct-model" | "fix-error") => {
  if (type === "generate-model") {
    let newMessages = messages.slice(-10);
    console.log(newMessages);
    newMessages = modifyNLastMessagesOfType<LLMImageMessage>(
      messages,
      1,
      (m) => m.type === "image",
      (m) => ({ ...m, type: "text", text: "Here was an image of the 3D model." }),
      1
    );
    const containsImage = newMessages.some((m) => m.type === "image");
    newMessages = modifyNLastMessagesOfType<LLMTextMessage>(
      messages,
      1,
      (m) => m.type === "text",
      (m) => ({ ...m, text: containsImage ? generateCodeWithImage(m.text) : generateCode(m.text) })
    );
    console.log(newMessages);
    return newMessages;
  }

  return messages.slice(-10);
};

const modifyNLastMessagesOfType = <T extends LLMMessage>(
  messages: LLMMessage[],
  n: number,
  filter: (message: LLMMessage) => boolean,
  modifier: (message: T) => LLMMessage,
  skipN: number = 0
): LLMMessage[] => {
  const newMessages = [];

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
  console.log(newMessages);

  return newMessages;
};
