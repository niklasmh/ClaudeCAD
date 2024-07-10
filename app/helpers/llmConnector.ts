import Anthropic from "@anthropic-ai/sdk";
import { LLMMessage, LLMTextMessage } from "../types/llm";
import { receiveFromPersistentStore, saveToPersistentStore } from "./persistentStorage";

type ErrorMessage = { error: string };

type LLMConnector = {
  [model: string]: (messages: LLMMessage[]) => Promise<string | ErrorMessage>;
};

const getAPIKey = (): string => {
  try {
    const key = receiveFromPersistentStore<string>("anthropic_api_key", "");
    if (!key) {
      throw new Error("No API key found");
    }
    return key;
  } catch (e) {
    const key = prompt("Please enter your Anthropic API key");
    if (key) {
      saveToPersistentStore<string>("anthropic_api_key", key);
      return key;
    }
    return "";
  }
};

const anthropicConnector = async (model: string, messages: LLMMessage[]): Promise<string | ErrorMessage> => {
  const response = (await fetch("/api/claude", {
    method: "POST",
    body: JSON.stringify({
      model: mapModel(model),
      temperature: 0,
      system: getSystemMessage(messages),
      messages: groupMessagesByRole(messages.map(mapMessage)),
      max_tokens: 1000,
      anthropic_api_key: getAPIKey(),
    }),
  }).then((r) => r.json())) as Anthropic.Messages.Message | ErrorMessage;
  try {
    if ("error" in response) {
      return response;
    }
    return (response.content[0] as any).text;
  } catch (e) {
    return response as never as ErrorMessage;
  }
};

export const llmConnector: LLMConnector = {
  "claude-1.2-instant": (messages) => anthropicConnector("claude-1.2-instant", messages),
  "claude-3-opus": (messages) => anthropicConnector("claude-3-opus", messages),
  "claude-3-sonnet": (messages) => anthropicConnector("claude-3-sonnet", messages),
  "claude-3-haiku": (messages) => anthropicConnector("claude-3-haiku", messages),
  "claude-3.5": (messages) => anthropicConnector("claude-3.5", messages),
};

const getSystemMessage = (messages: LLMMessage[]): string => {
  return messages
    .filter((message) => message.role === "system" && message.type === "text")
    .map((message) => (message as LLMTextMessage).text)
    .join("\n");
};

const mapRole = (role: LLMMessage["role"]): Anthropic.MessageCreateParamsNonStreaming["messages"][0]["role"] => {
  if (role === "user") {
    return "user";
  }
  return "assistant";
};

const mapMessage = (message: LLMMessage): Anthropic.MessageCreateParamsNonStreaming["messages"][0] => {
  if (message.type === "text") {
    return {
      role: mapRole(message.role),
      content: [{ type: message.type, text: message.text }],
    };
  } else if (message.type === "image") {
    return {
      role: mapRole(message.role),
      content: [
        {
          type: message.type,
          source: {
            type: "base64",
            media_type: "image/png",
            data: message.image.split(",")[1],
          },
        },
      ],
    };
  } else if (message.type === "code") {
    return {
      role: mapRole(message.role),
      content: [{ type: "text", text: "Here is the code used:\n\n```javascript\n" + message.text + "\n```" }],
    };
  } else if (message.type === "error") {
    return {
      role: mapRole(message.role),
      content: [
        { type: "text", text: "This is the error message from the code above:\n\n```\n" + message.text + "\n```" },
      ],
    };
  } else if (message.type === "model") {
    return {
      role: mapRole(message.role),
      content: [],
    };
  } else {
    throw new Error(`Unknown message type: ${(message as any).type}`);
  }
};

const groupMessagesByRole = (
  messages: Anthropic.MessageCreateParamsNonStreaming["messages"]
): Anthropic.MessageCreateParamsNonStreaming["messages"] => {
  const newMessages = [messages[0]];

  for (let i = 0; i < messages.length - 1; i++) {
    const message = messages[i];
    const nextMessage = messages[i + 1];

    if (message.role !== nextMessage.role) {
      newMessages.push(nextMessage);
    } else {
      newMessages[newMessages.length - 1].content = [
        ...newMessages[newMessages.length - 1].content,
        ...(nextMessage.content as any),
      ];
    }
  }

  return newMessages;
};

const mapModel = (model: string): Anthropic.MessageCreateParamsNonStreaming["model"] => {
  switch (model) {
    case "claude-1.2-instant":
      return "claude-instant-1.2";
    case "claude-3-opus":
      return "claude-3-opus-20240229";
    case "claude-3-sonnet":
      return "claude-3-sonnet-20240229";
    case "claude-3-haiku":
      return "claude-3-haiku-20240307";
    case "claude-3.5":
    default:
      return "claude-3-5-sonnet-20240620";
  }
};
