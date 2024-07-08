import { generateCode, generateCodeWithImage, generateCodeWithImageOnly } from "../prompts/generateCode";
import { LLMImageMessage, LLMMessage, LLMModel, LLMTextMessage } from "../types/llm";

export const buildMessageHistory = (messages: LLMMessage[], type: "generate-model" | "correct-model" | "fix-error") => {
  if (type === "generate-model") {
    let newMessages = [...messages];

    console.log(newMessages);

    // Replace all, except last two sketch message, with a text message
    newMessages = modifyNLastMessagesOfType<LLMImageMessage>(
      newMessages,
      Infinity,
      (m) => m.type === "image" && m.label === "sketch",
      (m) => ({ ...m, type: "text", text: "Here was an image of a sketched version of the model." }),
      2
    );

    // Replace all, except last model request image message (with sketch), with a text message
    newMessages = modifyNLastMessagesOfType<LLMImageMessage>(
      newMessages,
      Infinity,
      (m) => m.type === "image" && m.label === "model-with-sketch",
      (m) => ({ ...m, type: "text", text: "Here was an image of the 3D model." }),
      1
    );

    // Replace last text message with a code message, and make it an image message if there is an sketch in the messages
    const containsImage = newMessages.some((m) => m.type === "image" && m.label === "sketch");
    const containsText = newMessages.some((m) => m.type === "text");
    if (containsText) {
      newMessages = modifyNLastMessagesOfType<LLMTextMessage>(
        newMessages,
        1,
        (m) => m.type === "text",
        (m) => ({ ...m, text: containsImage ? generateCodeWithImage(m.text) : generateCode(m.text) })
      );
    } else if (containsImage) {
      // If no text message, then we need to add some description to the image and some instructions
      newMessages.push({
        type: "text",
        text: generateCodeWithImageOnly(),
        model: (newMessages.find((m) => m.type === "image") as LLMImageMessage).model,
        role: "user",
        date: new Date().toISOString(),
      });
    }

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
