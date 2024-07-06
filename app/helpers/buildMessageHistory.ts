import { generateCode } from "../prompts/generateCode";
import { LLMMessage, LLMTextMessage } from "../types/llm";

export const buildMessageHistory = (messages: LLMMessage[], type: "generate-model" | "correct-model" | "fix-error") => {
  if (type === "generate-model") {
    const newMessages = modifyNLastMessagesOfType(
      messages.slice(-10),
      1,
      (message) => message.type === "text",
      (message) => ({
        ...message,
        text: generateCode((message as LLMTextMessage).text),
      })
    );
    console.log(newMessages);
    return newMessages;
  }
  return messages.slice(-10);
};

const modifyNLastMessagesOfType = (
  messages: LLMMessage[],
  n: number,
  filter: (message: LLMMessage) => boolean,
  modifier: (message: LLMMessage) => LLMMessage
): LLMMessage[] => {
  const newMessages = [];

  for (let i = messages.length - 1, count = n; i >= 0; i--) {
    const message = messages[i];
    if (count > 0 && filter(message)) {
      newMessages.push(modifier(message));
      count--;
    } else {
      newMessages.push(message);
    }
  }

  newMessages.reverse();
  console.log(newMessages);

  return newMessages;
};
